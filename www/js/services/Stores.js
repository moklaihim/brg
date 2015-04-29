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
    function todayDate(){
        var today=new Date();
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        if (month < 10) { month = '0' + month; }
        var day = today.getDate();
        if (day < 10) { day = '0' + day; }
        return year + "/" + month + "/" + day;
    }

    return {
        set_current: function(store_id, store_name){
            var date = todayDate();
            window.localStorage.setItem("store_date", date);
            window.localStorage.setItem("store_id", store_id);
            window.localStorage.setItem("store_name", store_name);
            return store_id;
        },
        get_current: function(){
            var date = todayDate();
            var current_store = {};
            if(window.localStorage.getItem('store_date') == date){
                var store_id = window.localStorage.getItem('store_id');
                var store_name = window.localStorage.getItem('store_name');
                current_store = {id: store_id, name: store_name}
                //var store_tmp = Stores.get_one('taka');
                //console.log("store_tmp " + store_tmp);
            }
            return current_store;
        },
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
