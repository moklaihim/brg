angular.module('starter.services')
.factory('Items', ["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray) {

    var items = new Object();
    var items_array = new Array();
    var is_online;

    return {
        online: function(){
            var fItems = new Firebase("https://fiery-heat-6039.firebaseio.com/items");
            fItems.on("value", function(snapshot) {
                localStorage.setItem('brg_items', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            }); 

            items = $firebaseObject(fItems);
            items_array = $firebaseArray(fItems);
            is_online = true;
        },

        offline: function(){
            items = JSON.parse(localStorage.getItem('brg_items'));
            items_array = Object.keys(items).map(function(key) { return items[key] });
            is_online = false;
        },

        get: function(){
            return items;
        },

        get_as_array: function(){
            return items_array;
        },

        add: function(item_id, retail_price){
            var now = new Date();
            var current_ut = now.getTime();

            if(is_online){
                /*
                var fItem = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + item_id);
                //localStorage.clear();
                var item = $firebaseObject(fItem);

                item.id = item_id;
                item.retail_price = retail_price;
                item.timestamp = current_ut;
                item.$save();
                */
                items[item_id] = new Object();
                items[item_id].id = item_id;
                items[item_id].retail_price = retail_price;
                items[item_id].timestamp = current_ut;
                items.$save();
            }else{
                items[item_id] = new Object();
                items[item_id].id = item_id;
                items[item_id].retail_price = retail_price;
                items[item_id].timestamp = current_ut;
            }
        }
    }
}]);
