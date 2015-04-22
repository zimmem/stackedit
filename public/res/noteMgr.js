define([
        'eventMgr',
        'helpers/evernoteHelper'
], function(eventMgr, helper){
	
	var noteMgr = {};
	
	noteMgr.listNots = function(callback){
		helper.listNotes(callback);
	}
	
	eventMgr.onNoteMgrCreated(noteMgr);
	
	return noteMgr;
	
});