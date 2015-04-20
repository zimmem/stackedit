define([ "jquery", "constants", "core", "utils", "storage", "logger",
		"eventMgr", "classes/AsyncTask" ], function($, C, core, utils, storage, log, eventMgr, AsyncTask) {
	
	var evernoteHelper = {};
	
	var isListenAuthenticate = false;
	
	evernoteHelper.authenticate = function(){
		if(!isListenAuthenticate){
			window.addEventListener('message', function(e){
				if(e.data === 'evernote.authenticate.success' && e.origin == location.origin){
					getUser();
				}
			});
			isListenAuthenticate = true;
		}
		
		window.open('/evernote/authenticate', '_blank', 'height=600px, width=800px');
	}
	
	getUser = function(){
		var task = new AsyncTask();
		task.onRun(function(){
			$.ajax({
				url : '/evernote/user',
				dataType  : 'JSON',
				success : function(user){
					$('#user-name').text(user.name);
					$('#user-name-wrapper').show();
					$('#evernote-connector').hide();
				}
			})
		});
		task.enqueue();
	}
	
	return evernoteHelper;
});