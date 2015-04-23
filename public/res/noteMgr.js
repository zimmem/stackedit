define([
        'eventMgr',
        'helpers/evernoteHelper',
        'fileSystem',
        'classes/FileDescriptor',
        'utils'
], function(eventMgr, helper, fileSystem, FileDescriptor, utils){
	
	var noteMgr = {};
	
	noteMgr.listNots = function(callback){
		helper.listNotes(callback);
	}
	
	noteMgr.refreshNotes = function(){
		noteMgr.listNots(function(error, notes){
			if(error){
				eventMgr.onError(error);
				return;
			}
			fileSystem.listFiles(function(files){
				var noteMap = {};
				_.each(notes, function(note){
					noteMap[note.guid] = note;
 				})
 				
 				var fileMap = {};
				_.each(files, function(file){
					fileMap[file.guid] = file;
				});
				
				var filesToCreate = [];
				var filteredNotes = _.filter(notes, function(note){
					return fileMap[note.guid] == null;
				});
				_.each(filteredNotes, function(note){
					var file = new FileDescriptor('file.'+utils.id());
					file.update(note);
					// TODO 改面批量异步
					filesToCreate.push(file);
				})
				
				var filesToUpdate = [];
				var filteredFile = _.filter(files, function(file){
					return noteMap[file.guid] != null;
				});
				_.each(filteredFile, function(file){
					//TODO 改面批量异步
					file.update(noteMap[file.guid]);
				})
				
				eventMgr.onNotesRefresh();
				
			});
		});
	}
	noteMgr.downloadNote = function(guid, callback){
		helper.downloadNote(guid, callback);
	}
	
	noteMgr.postNote = function(file, callback){
		helper.postNote(file, callback);
	}
	
	eventMgr.onNoteMgrCreated(noteMgr);
	
	return noteMgr;
	
});