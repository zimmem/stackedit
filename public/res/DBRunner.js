define([], function() {

	var DBRunner = {};
	
	DBRunner.db = null;
	DBRunner.creating = false;
	DBRunner.created = false;
	
	function waitToRun(callback){
		if(DBRunner.creating){
			setTimeout(function(){
				waitToRun(callback);
			}, 100);
		}else{
			callback(DBRunner.db);
		}
	}
	
	DBRunner.run = function(callback) {
		if(DBRunner.created){
			callback(DBRunner.db);
		}else if(DBRunner.creating){
			waitToRun(callback);
		}else{
			var  request = indexedDB.open("notedown",2);
			DBRunner.creating = true;
			request.onupgradeneeded = function(e) {
				console.info(e);
				// The database did not previously exist, so create object stores
				// and indexes.
				var db = request.result;
				var noteStore = db.createObjectStore("notes", {
					keyPath : "key"
				});
				noteStore.createIndex("by_guid", "guid", {
					unique : true
				});
				
				noteStore.createIndex("by_selectTime", "selectTime", {
					unique : false
				});
				
				

				var notebookStore = db.createObjectStore("notebooks", {
					keyPath : "guid"
				});
			};

			request.onsuccess = function() {
				DBRunner.db = request.result;
				DBRunner.creating = false;
				DBRunner.created = true;
				callback(request.result);
			};

			request.onerror = function(){
				console.error("open indexedDB error");
			}
		}
		
	}

	return DBRunner;

});