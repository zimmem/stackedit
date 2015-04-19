define([
    "underscore",
    "utils",
    "classes/Provider",
    "helpers/evernoteHelper"
], function(_, utils, Provider, wordpressHelper) {
	
	var evernoteProvide = new Provider("evernote", "Evernote");
	
//	evernoteProvide.getPublishLocationLink = function(attributes) {
//		return attributes.siteId && [
//			'https://wordpress.com/post',
//			attributes.siteId,
//			attributes.postId
//		].join('/');
//	};
	
	evernoteProvide.getSyncLocationLink = function(attributes) {
		return [
			location.origin,
			'/evernote/notes/',
			attributes.guid
		].join('');
	};
	
	evernoteProvide.publish = function(title, content, callback) {
       
        evernoteHelper.upload(title, content, function(error) {
        	console.info("xxxxxx:" + title);
            if(error) {
                return callback(error);
            }
            callback();
        });
    };
	
});