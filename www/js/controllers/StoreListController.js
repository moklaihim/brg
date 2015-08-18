angular.module('starter.controllers')
.controller('StoreListController', ["$ionicPlatform", "$rootScope", "$scope", "$timeout", "$state", "$ionicLoading", "$ionicHistory", "$cordovaGeolocation", "Stores", function($ionicPlatform, $rootScope, $scope, $timeout, $state, $ionicLoading, $ionicHistory, $cordovaGeolocation, Stores) {
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
        $scope.showSpinner = true;
        p_stores_array = Stores.get_list_as_array();
        p_stores_array.then(function(r_stores_array){
            stores_array = r_stores_array;
            calcDistance();
        });
    }

    function calcDistance(){
        var posOptions = {timeout: 5000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                //console.log(lat + " " + lng + " OK");
                for (var i = 0; i < stores_array.length; i++) {
                    stores_array[i].distance = Math.round(distance(lat, lng, stores_array[i].lat, stores_array[i].lng, "K")*1000);
                    if(stores_array[i].distance > 1000){
                        stores_array[i].distance_disp = Math.round(stores_array[i].distance / 100) / 10 + "km";
                    }else{
                        stores_array[i].distance_disp = stores_array[i].distance + "m";
                    }
                    //console.log($scope.stores_array[i].name + " " + $scope.stores_array[i].distance_disp + " OK");
                }

                stores_array.sort(
                    function(a, b){
                        var aStoreDist = a['distance'];
                        var bStoreDist = b['distance'];
                        if(aStoreDist > bStoreDist) return 1;
                        if(aStoreDist < bStoreDist) return -1;
                        return 0
                    }
                );

                $scope.showSpinner = false;
                $scope.stores_array = stores_array;
                $scope.current.nearestStore = stores_array[0].id;
                localStorage.setItem('brg_nearestStore', stores_array[0].id);
            }, function(err) {
                $scope.showSpinner = false;
                $scope.stores_array = stores_array;
            });
    }

    $scope.selectStore = function(store_id, store_name){
        window.localStorage.setItem("store_date", $scope.current.today_date);
        window.localStorage.setItem("store_id", store_id);
        window.localStorage.setItem("store_name", store_name);

        $scope.current.store_id = store_id;
        $scope.current.store_name = store_name;

        //console.log("CurrentStore set to id: " + $scope.current.store_id + " name: " + $scope.current.store_name);
        // $ionicHistory.goBack();
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('main.sales_list');
    };

}])
