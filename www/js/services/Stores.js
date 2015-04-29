angular.module('starter.services')
.factory('Stores', ["$timeout", "$firebaseObject", "$firebaseArray", function($timeout, $firebaseObject, $firebaseArray) {

    OfflineFirebase.restore();
    var fStores = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/stores");
    fStores.on('value', function(snapshot) {
        //console.log(snapshot.val());
    }, undefined, undefined, true);
    //localStorage.clear();
    var stores = $firebaseObject(fStores);
    var stores_array = $firebaseArray(fStores);

    return {
        get: function(){
            return stores;
        },
        // get_as_array: function(storeid){
        //     return stores_array;
        // }
        get_as_array: function(storeId) {
            for (var i = 0; i < stores_array.length; i++) {
                if (stores_array[i].id === parseInt(storeId)) {
                    return stores_array[i];
                }
            }
            return null;
        }
    }
}]);
