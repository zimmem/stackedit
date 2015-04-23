define([
	"jquery",
	"underscore",
	"constants",
	"core",
	"utils",
	"storage",
	"settings",
	"eventMgr",
	"fileSystem",
	"DBRunner",
	"classes/FileDescriptor",
	"text!WELCOME.md"
], function($, _, constants, core, utils, storage, settings, eventMgr, fileSystem, DBRunner, FileDescriptor, welcomeContent) {

	var fileMgr = {};

	// Defines the current file
	fileMgr.currentFile = undefined;

	// Set the current file and refresh the editor
	fileMgr.selectFile = function(key) {
		
		if(fileMgr.currentFile && fileMgr.currentFile.key === key){
			return;
		}
		
		
 		// TODO : selecte latest file or create new file
		if(key === undefined) {
			fileSystem.getLastFile(function(file){
				if(!file){
					file = fileMgr.createFile(constants.WELCOME_DOCUMENT_TITLE);
				}
				onFileSelected(file);
				
			});
			return 

		}

		if(!fileMgr.currentFile || fileMgr.currentFile.key !== key) {
			
			DBRunner.run(function(db){
				var tx = db.transaction("notes", "readwrite");
				var store = tx.objectStore("notes");
				var request = store.get(key);
				request.onsuccess = function() {
					var note = request.result;
					var file = new FileDescriptor();
					file.note = note;
					
					file.selectTime = new Date().getTime();
					onFileSelected(file);
				};
			});
			
		}
		
		function onFileSelected(file){
			console.info("selected fiile " + file.key);
			fileMgr.currentFile = file;
			file.selectTime = new Date().getTime();
			eventMgr.onFileSelected(file);
			core.initEditor(file);
		}

		
	};

	fileMgr.createFile = function(content , callback) {
		var content = content !== undefined ? content : settings.defaultContent;

		// Generate a unique fileIndex
		var fileIndex = constants.TEMPORARY_FILE_INDEX;
		fileIndex = "file." + utils.id();

		storage[fileIndex + ".content"] = content;

		// Create the file descriptor
		var fileDesc = new FileDescriptor(fileIndex);
		fileDesc.store(function(){
			callback && callback(fileDesc);
			eventMgr.onFileCreated(fileDesc);
		});
		return fileDesc;
	};

	fileMgr.deleteFile = function(fileDesc, callaback) {
		fileDesc = fileDesc || fileMgr.currentFile;

		// Remove the index from the file list
		utils.removeIndexFromArray("file.list", fileDesc.fileIndex);
		delete fileSystem[fileDesc.fileIndex];

		// Don't bother with fields in localStorage, they will be removed on next page load

		if(fileMgr.currentFile === fileDesc) {
			// Unset the current fileDesc
			fileMgr.currentFile = undefined;
			// Refresh the editor with another file
			fileMgr.selectFile();
		}

		eventMgr.onFileDeleted(fileDesc);
	};


	eventMgr.addListener("onReady", function() {
		var $editorElt = $("#wmd-input");
		fileMgr.selectFile();

		var $fileTitleElt = $('.file-title-navbar');
		var $fileTitleInputElt = $(".input-file-title");
		$(".action-create-file").click(function() {
			setTimeout(function() {
				var fileDesc = fileMgr.createFile();
				fileMgr.selectFile(fileDesc);
				$fileTitleElt.click();
			}, 400);
		});
		$('.action-remove-file-confirm').click(function() {
			$('.modal-remove-file-confirm').modal('show');
		});
		$(".action-remove-file").click(function() {
			fileMgr.deleteFile();
		});
		$(".action-open-stackedit").click(function() {
			window.location.href = "editor";
		});
		$(".action-edit-document").click(function() {
			var content = $editorElt.val();
			var title = fileMgr.currentFile.title;
			var fileDesc = fileMgr.createFile(title, content);
			fileMgr.selectFile(fileDesc);
			window.location.href = "editor";
		});
		$(".action-welcome-file").click(function() {
			var fileDesc = fileMgr.createFile(welcomeContent, function(){
				fileMgr.selectFile(fileDesc);
			});
		});
	});

	eventMgr.onFileMgrCreated(fileMgr);
	return fileMgr;
});
