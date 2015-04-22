define([ "jquery", "constants", "core", "utils", "storage", "logger",
		"eventMgr", "classes/AsyncTask" ], function($, C, core, utils, storage,
		log, eventMgr, AsyncTask) {

	var evernoteHelper = {};

	var isListenAuthenticate = false;

	evernoteHelper.authenticate = function() {
		if (!isListenAuthenticate) {
			window.addEventListener('message', function(e) {
				if (e.origin == location.origin) {
					if(e.data === 'evernote.authenticate.success'){
						getUser();
						storage['evernote.login'] = true;
					}
				}

			});
			isListenAuthenticate = true;
		}

		window.open('/evernote/authenticate', '_blank',
				'height=600px, width=800px');
	}

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
					task.error()
				}
			});
		});
		task.onError(function(e){
			callback(e);
		});
		task.onSuccess(function(){
			callback(undefined, result);
		})
		task.enqueue();
	};

	function checkAuth(task) {
		if(storage['evernote.login'] ){
			return;
		}else{
			task.error(new Error("Please connect to Evernote first!"));
		}
	}

	getUser = function() {
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
			})
		});
		task.enqueue();
	}

	return evernoteHelper;
});