define([ "jquery",'underscore', "constants", "core", "utils", "storage", "logger", 
		"eventMgr", "classes/AsyncTask" ], function($, _, C, core, utils, storage,
		log, eventMgr, AsyncTask) {

	var evernoteHelper = {};

	var isListenAuthenticate = false;

	evernoteHelper.authenticate = function() {
		if (!isListenAuthenticate) {
			window.addEventListener('message', function(e) {
				if (e.origin == location.origin) {
					if(e.data === 'evernote.authenticate.success'){
						evernoteHelper.getUser();
						storage['evernote.login'] = true;
					}
				}

			});
			isListenAuthenticate = true;
		}

		window.open('/evernote/authenticate', '_blank',
				'height=600px, width=800px');
	};

	evernoteHelper.listNotes = function(callback) {
		var task = new AsyncTask();
		checkAuth(task);

		var result = null;
		task.onRun(function(){
			$.ajax({
				url : "/evernote/notes",
				success : function(notes){
					result = notes;
					task.chain();
				},
				error : function(){
					task.error();
				}
			});
		});
		task.onError(function(e){
			callback(e);
		});
		task.onSuccess(function(){
			callback(undefined, result);
		});
		task.enqueue();
	};
	
	evernoteHelper.downloadNote = function(guid, callback){
		var task = new AsyncTask();
		checkAuth(task);

		var result = null;
		task.onRun(function(){
			$.ajax({
				url : "/evernote/notes/" + guid,
				success : function(note){
					result = note;
					task.chain();
				},
				error : function(){
					task.error();
				}
			});
		});
		task.onError(function(e){
			callback(e);
		});
		task.onSuccess(function(){
			callback(undefined, result);
		});
		task.enqueue();
	};
	
	evernoteHelper.postNote = function(file, callback){
		
		if(!file){
			return;
		}
		
		var url = file.guid ? '/evernote/notes/' + file.guid : '/evernote/notes';
		var method = file.guid ? 'PUT' : 'POST';
		var markdown = file.content;
		var $clone = $('#preview-contents').clone();
		
		function removeAttribute($root, attName){
			$root.removeAttr(attName);
			$root.children().each(function(i, e){
				removeAttribute($(e), attName);
			});
		}
		
		//remove all unsupport attribute
		removeAttribute($clone, 'id');
		removeAttribute($clone, 'class');
		
		//暂时这么处理 br吧
		var html =  $clone.html().replace(/<br>/g, "<br/>").replace(/<hr>/g, "<hr/>");
		console.info(html);
		html = [
            '<div>',
            html,
            '<center style="display:none;">',
            markdown,
            '</center>',
            '</div>'
        ].join('');
		
		var task = new AsyncTask();
		checkAuth(task);
		task.onRun(function(){
			$.ajax({
				url : url ,
				type : method,
				contentType: "application/json",
				beforeSend: function(xhrObj){
					xhrObj.setRequestHeader("Content-Type","application/json");
					xhrObj.setRequestHeader("Accept","application/json");
				},
				data : JSON.stringify(_.extend(_.clone(file.note), {content: html})),
				success : function(note){
					file.update(_.extend(note, {localEdite: false}));
					task.chain();
				},
				error : function(){
					task.error();
				}
				
			});
		});
		task.onError(function(e){
			callback(e);
		});
		task.onSuccess(function(){
			callback();
		});
		task.enqueue();
	};

	function checkAuth(task) {
		if(storage['evernote.login'] ){
			return;
		}else{
			task.error(new Error("Please connect to Evernote first!"));
		}
	}

	evernoteHelper.getUser = function() {
		var task = new AsyncTask();
		task.onRun(function() {
			$.ajax({
				url : '/evernote/user',
				dataType : 'JSON',
				success : function(user) {
					$('#user-name').text(user.name);
					$('#user-name-wrapper').show();
					$('#evernote-connector').hide();
					task.chain();
				},
				error: function(){
					task.error("Error occurred while fetch user info");
				}
			});
		});
		task.enqueue();
	};
	
	// ready 时尝试拉取用户信息
	eventMgr.addListener('onReady', function(){
		evernoteHelper.getUser();
	});

	return evernoteHelper;
});