define([
    'jquery',
    "eventMgr",
    'fileMgr',
    'helpers/evernoteHelper'
], function($,eventMgr, fileMgr, evernoteHelper) {

	eventMgr.addListener("onReady", function() {
		

		$('.action-connect-evernote').click(function() {
			evernoteHelper.authenticate();
		});

		$('.action-create-note').click(function() {
			fileMgr.createFile('',function(file){
				fileMgr.selectFile(file.key);
			});
		});

		$('.action-delete-note').click(function() {

		});

		$('.action-share-note').click(function() {

		});
	});

});