define([
    "eventMgr",
    'helpers/evernoteHelper'
], function(eventMgr, evernoteHelper) {

	eventMgr.addListener("onReady", function() {

		$('.action-connect-evernote').click(function() {
			evernoteHelper.authenticate();
		});

		$('.action-create-note').click(function() {

		});

		$('.action-delete-note').click(function() {

		});

		$('.action-share-note').click(function() {

		});
	});

});