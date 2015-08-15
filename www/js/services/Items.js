angular.module('starter.services')
.factory('Items', ["$firebaseObject", "$firebaseArray", "$state", function($firebaseObject, $firebaseArray, $state) {

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
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
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

        get_retail_price: function(id){
            var retail_price = items[id].retail_price;
            return retail_price;
        },

        remove: function(key){

            if(is_online){
                // var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key);
                var fItems = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + key);
                var item = $firebaseObject(fItems);
                item.$remove().then(function(fItems){
                    console.log("Item" + key +"removed from server");
                }, function(error) {
                    console.log("Error:", error);
                });
            }else{
                delete items[key];
            }
        },

        add: function(item_id, retail_price){
            var now = new Date();
            var current_ut = now.getTime();

            if(is_online){
                // if(!item_edit_key){
                //     items[item_id] = new Object();
                // }
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
