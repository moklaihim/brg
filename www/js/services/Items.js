angular.module('starter.services')
.factory('Items', ["$rootScope", "$cordovaNetwork", "$firebaseObject", "$firebaseArray", function($rootScope, $cordovaNetwork, $firebaseObject, $firebaseArray) {

    //OfflineFirebase.restore();
    //localStorage.clear();
    var items = new Object();
    var items_array = new Array();
    var is_online = false;

    var deviceInformation = ionic.Platform.device();
    if(deviceInformation.platform == "Android" || deviceInformation.platform == "iOS"){
        ionic.Platform.ready(function(){
            var isOffline = $cordovaNetwork.isOffline();
            if(isOffline){
                console.log("Items detected Offline");
                is_online = false;
                items = JSON.parse(localStorage.getItem('brg_items'));
                items_array = Object.keys(items).map(function(key) { return items[key] });
                $rootScope.$on('$cordovaNetwork:online', onOnline);
            }else{
                console.log("Items detected Online");
                onOnline();
            }
        });
    }else{
        onOnline();
    }

    function onOnline() {
        if(!is_online){
            is_online = true;

            var fItems = new Firebase("https://fiery-heat-6039.firebaseio.com/items");

            fItems.on("value", function(snapshot) {
                localStorage.setItem('brg_items', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            }); 

            items = $firebaseObject(fItems);
            items_array = $firebaseArray(fItems);
        }   
    }

    return {
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
                var fItem = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + item_id);
                //localStorage.clear();
                var item = $firebaseObject(fItem);

                item.id = item_id;
                item.retail_price = retail_price;
                item.timestamp = current_ut;
                item.$save();
            }else{
                //dont do anything
                items[item_id] = new Object();
                items[item_id].id = item_id;
                items[item_id].retail_price = retail_price;
            }
        }
    }
}]);
