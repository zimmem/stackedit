define([
    "jquery",
    "underscore",
    "classes/Extension"
], function($, _, Extension) {
	var pageTitle = new Extension("pageTitle", "Page Title", true);
	
	pageTitle.onPagedownConfigure = function(editor){
		var $previewContents = $('#preview-contents');
		console.info(previewContentsElt);
		editor.hooks.chain("onPreviewRefresh", function() {
			var title = $previewContents.find('h1').first().text();
			title = title || 'Untitled';
			var pagetitle = title + ' - Notedown';
			
			document.title = pagetitle;
		});
	};
	
	return pageTitle
	
});