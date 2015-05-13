angular.module('starter.services')
.factory('Stores', ["$rootScope", "$cordovaNetwork", "$firebaseObject", "$firebaseArray", function($rootScope, $cordovaNetwork, $firebaseObject, $firebaseArray) {
    var stores;
    var stores_array;
    var is_online = false;

    var deviceInformation = ionic.Platform.device();
    if(deviceInformation.platform == "Android" || deviceInformation.platform == "iOS"){
        ionic.Platform.ready(function(){
            var isOffline = $cordovaNetwork.isOffline();

            if(isOffline){
                console.log("Stores detected Offline");
                onOffline();
            }else{
                console.log("Stores detected Online");
                onOnline();
            }
        });
    }else{
        onOnline();
    }

    function onOnline() {
        if(!is_online){
            is_online = true;

            var fb_path = "https://fiery-heat-6039.firebaseio.com/stores";
            var fStores = new Firebase(fb_path);

            fStores.on("value", function(snapshot) {
                localStorage.setItem('brg_stores', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            });

            stores = $firebaseObject(fStores);
            stores_array = $firebaseArray(fStores);
        }
    }

    function onOffline(){
        is_online = false;
        stores = JSON.parse(localStorage.getItem('brg_stores'));
        stores_array = Object.keys(stores).map(function(key) { return stores[key] });
        $rootScope.$on('$cordovaNetwork:online', onOnline);
    }

    return {
        get_list: function(){
            return stores;
        },
        get_list_as_array: function(){
            return stores_array;
        },
        on_timeout: function(){
            onOffline();
        }
    }
}]);
