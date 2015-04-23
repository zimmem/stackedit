define([
    "underscore",
    "utils",
    "classes/FileDescriptor",
    "storage",
    'DBRunner'
], function(_, utils, FileDescriptor, storage, DBRunner) {
    var fileSystem = {};

    // Retrieve file descriptors from localStorage
    utils.retrieveIndexArray("file.list").forEach(function(fileIndex) {
        fileSystem[fileIndex] = new FileDescriptor(fileIndex);
    });

    // Clean fields from deleted files in local storage
    Object.keys(storage).forEach(function(key) {
        var match = key.match(/(file\.\S+?)\.\S+/);
        if(match && !fileSystem.hasOwnProperty(match[1])) {
            storage.removeItem(key);
        }
    });
    
    fileSystem.getLastFile = function(callback){
    	DBRunner.run(function(db){
    		var tx = db.transaction("notes", "readonly");
			var store = tx.objectStore("notes");
			var index = store.index('by_selectTime');
			
			var request = index.openCursor(null, IDBCursor.prev);
			request.onsuccess = function(event) {
				var cursor = event.target.result;
				console.info(cursor);
				if (cursor) {
				    // Do something with the entries.
					var note = cursor.value;
					console.info(note);
					var file = new FileDescriptor();
					file.note = note;
					callback(file);
				    //cursor.continue();
				}else{
					callback();
				}
			};
			request.onerror = function(e){
			  	console.info(e);
			}
			
    	});
    }

    return fileSystem;
});
