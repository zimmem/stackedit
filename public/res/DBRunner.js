define([], function() {

	var DBRunner = {};
	
	var db = null;
	var creating = false;
	var created = false;
	
	function waitToRun(callback){
		if(creating){
			setTimeout(function(){
				waitToRun(callback);
			}, 100);
		}else{
			callback(db);
		}
	}
	
	DBRunner.run = function(callback) {
		if(created){
			callback(db);
		}else if(creating){
			waitToRun(callback);
		}else{
			var  request = indexedDB.open("notedown");
			creating = true;
			request.onupgradeneeded = function() {
				// The database did not previously exist, so create object stores
				// and indexes.
				var db = request.result;
				var noteStore = db.createObjectStore("notes", {
					keyPath : "key"
				});
				noteStore.createIndex("by_guid", "guid", {
					unique : true
				});

				var notebookStore = db.createObjectStore("notebooks", {
					keyPath : "guid"
				});
			};

			request.onsuccess = function() {
				db = request.result;
				creating = false;
				created = true;
				callback(request.result);
			};
		}
		
	}

	return DBRunner;

});