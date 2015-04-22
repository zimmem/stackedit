define([
    "jquery",
    "underscore",
    "classes/Extension"
], function($, _, Extension) {
	var pageTitle = new Extension("pageTitle", "Page Title", true);
	
	var fileMgr = null;
	
	pageTitle.onFileMgrCreated = function(theFileMgr){
		fileMgr = theFileMgr
	}
	
	pageTitle.onPagedownConfigure = function(editor){
		editor.hooks.chain("onPreviewRefresh", function() {
			var $previewContents = $('#preview-contents');
			var title = $previewContents.find('h1').first().text();
			title = title || 'Untitled';
			var pagetitle = title + ' - Notedown';
			document.title = pagetitle;
			
			if(fileMgr && fileMgr.currentFile ){
				 fileMgr.currentFile.title = title;
			}
		});
	};
	
	return pageTitle
	
});