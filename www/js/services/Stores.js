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

    var current_store_id;

    return {
        get_list: function(){
            return stores;
        },
        get_list_as_array: function(){
            return stores_array;
        },
        get_one: function($store_id){
            console.log("get_one for " + $store_id);
            console.log(stores);
            console.log(stores.hasOwnProperty('taka'));
            return store_tmp;
        }
        // get_as_array: function(storeId) {
        //     for (var i = 0; i < stores_array.length; i++) {
        //         if (stores_array[i].id === parseInt(storeId)) {
        //             return stores_array[i];
        //         }
        //     }
        //     return null;
        // }
    }
}]);
