angular.module('starter.services')
.factory('Items', ["$timeout", "$firebaseObject", "$firebaseArray", function($timeout, $firebaseObject, $firebaseArray) {

    //OfflineFirebase.restore();
    var fItems = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/items");
    fItems.on('value', function(snapshot) {
        //console.log(snapshot.val());
    }, undefined, undefined, true);
    //localStorage.clear();
    var items = $firebaseObject(fItems);
    var items_array = $firebaseArray(fItems);

    return {
        get: function(){
            return items;
        },

        get_as_array: function(){
            return items_array;
        },

        add: function(item_id, retail_price){
            items[item_id] = {id: item_id, retail_price: retail_price};
            items.$save();
        }
    }
}]);
