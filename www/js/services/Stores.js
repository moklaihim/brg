angular.module('starter.services')
.factory('Stores', ["$timeout", "$firebaseObject", "$firebaseArray", function($timeout, $firebaseObject, $firebaseArray) {

    //OfflineFirebase.restore();
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
        get_list: function(){
            return stores;
        },
        get_list_as_array: function(){
            return stores_array;
        },
        get_one: function($store_id){
            stores.$loaded()
                .then(function() {
                    return stores[$store_id];
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }
}]);
