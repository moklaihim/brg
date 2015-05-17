angular.module('starter.controllers')
.controller('StoreListController', ["$ionicPlatform", "$rootScope", "$scope", "$timeout", "$state", "$cordovaGeolocation", "Stores", function($ionicPlatform, $rootScope, $scope, $timeout, $state, $cordovaGeolocation, Stores) {
    console.log("BRG Debug: StoreListController Started");

    var stores_array;
    showStoreList();

    function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }

    function showStoreList(){
        console.log("BRG Debug: showStoreList started");
        $scope.showSpinner = true;
        console.log("BRG Debug: showStoreList step2");
        stores_array = Stores.get_list_as_array();
        console.log(stores_array);

        if(stores_array.$loaded){
            console.log("BRG Debug: This is angularfire_array object");
            stores_array.$loaded()
                .then(function() {
                    console.log("BRG Debug: stores_array loaded successfully");
                    calcDistance();
                })
                .catch(function(err) {
                    console.error("BRG Debug: stores_array loaded failed" + err);
                    stores_array = Stores.get_list_as_array();
                    calcDistance();
                });

            console.log("BRG Debug: Setting timeout");
        }else{
            console.log("BRG Debug: This is just an array");
            calcDistance();
        }
    }

    function calcDistance(){
        var posOptions = {timeout: 5000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                console.log("BRG Debug: showStoreList step4");
                //console.log(lat + " " + lng + " OK");
                for (var i = 0; i < stores_array.length; i++) {
                    console.log("BRG Debug: Calculate distance for " + stores_array[i].name);
                    stores_array[i].distance = Math.round(distance(lat, lng, stores_array[i].lat, stores_array[i].lng, "K")*1000);
                    if(stores_array[i].distance > 1000){
                        stores_array[i].distance_disp = Math.round(stores_array[i].distance / 100) / 10 + "km";
                    }else{
                        stores_array[i].distance_disp = stores_array[i].distance + "m";
                    }
                    //console.log($scope.stores_array[i].name + " " + $scope.stores_array[i].distance_disp + " OK");
                }

                console.log("BRG Debug: showStoreList step5");
                $scope.showSpinner = false;
                $scope.stores_array = stores_array;
            }, function(err) {
                console.log("BRG Debug: Error on getting current position");
                $scope.showSpinner = false;
                $scope.stores_array = stores_array;
            });
        console.log("BRG Debug: showStoreList end");
    }

    $scope.selectStore = function(store_id, store_name){
        window.localStorage.setItem("store_date", $scope.current.today_date);
        window.localStorage.setItem("store_id", store_id);
        window.localStorage.setItem("store_name", store_name);

        $scope.current.store_id = store_id;
        $scope.current.store_name = store_name;

        console.log("CurrentStore set to id: " + $scope.current.store_id + " name: " + $scope.current.store_name);
        $state.go('main.sales_list');
    };

}])
