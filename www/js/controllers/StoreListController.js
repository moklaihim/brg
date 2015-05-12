angular.module('starter.controllers')
.controller('StoreListController', ["$ionicPlatform", "$rootScope", "$scope", "$timeout", "$state", "$cordovaNetwork", "$cordovaGeolocation", "Stores", function($ionicPlatform, $rootScope, $scope, $timeout, $state, $cordovaNetwork, $cordovaGeolocation, Stores) {
    console.log("BRG Debug: StoreListController Started");

    var stores_array;
    showStoreList();
    //createInitialData();
    //

    /*
    document.addEventListener("deviceready", function () {
        console.log("TOMdebug: Device Ready");
        var isOnline = $cordovaNetwork.isOnline();
        var isOffline = $cordovaNetwork.isOffline();

        if(isOnline){
            console.log("TOMdebug: Online");
        }
        if(isOffline){
            console.log("TOMdebug: Offline");
        }
        
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("Become Online");
        });
      
    }, false);
    */

    function createInitialData(){
        $scope.stores['taka'] = {id: 'taka', name: 'TAKA', lat: 1.302479, lng: 103.834615, timestamp: 1430663266989};
        $scope.stores['isetan_scotts'] = {id: 'isetan_scotts', name: 'ISETAN SCOTTS', lat: 1.305732, lng: 103.8315, timestamp: 1430663266989};
        $scope.stores['isetan_tmp'] = {id: 'isetan_tmp', name: 'ISETAN TMP', lat: 1.352492, lng: 103.944797, timestamp: 1430663266989};
        $scope.stores['isetan_nex'] = {id: 'isetan_nex', name: 'ISETAN NEX', lat: 1.305589, lng: 103.831510, timestamp: 1430663266989};
        $scope.stores['isetan_katong'] = {id: 'isetan_katong', name: 'ISETAN KATONG', lat: 1.301547, lng: 103.904688, timestamp: 1430663266989};
        $scope.stores['isetan_westgate'] = {id: 'isetan_westgate', name: 'ISETAN WESTGATE', lat: 1.334033, lng: 103.742837, timestamp: 1430663266989};
        $scope.stores['robs_rc'] = {id: 'robs_rc', name: 'Robs RC', lat: 1.293775, lng: 103.852741, timestamp: 1430663266989};
        $scope.stores['robs_orch'] = {id: 'robs_orch', name: 'Robs Orch', lat: 1.302399, lng: 103.837175, timestamp: 1430663266989};
        $scope.stores['robs_jem'] = {id: 'robs_jem', name: 'Robs JEM', lat: 1.333381, lng: 103.743388, timestamp: 1430663266989};
        $scope.stores['tangs_orch'] = {id: 'tangs_orch', name: 'Tangs Orch', lat: 1.304975, lng: 103.832957, timestamp: 1430663266989};
        $scope.stores['tangs_vivo'] = {id: 'tangs_vivo', name: 'Tangs Vivo', lat: 1.264797, lng: 103.822047, timestamp: 1430663266989};
        $scope.stores['bhg_bugis'] = {id: 'bhg_bugis', name: 'BHG Bugis', lat: 1.300001, lng: 103.855588, timestamp: 1430663266989};
        $scope.stores['metro_paragon'] = {id: 'metro_paragon', name: 'Metro Paragon', lat: 1.303753, lng: 103.835716, timestamp: 1430663266989};
        $scope.stores['metro_woodlands'] = {id: 'metro_woodlands', name: 'Metro Woodlands', lat: 1.435820, lng: 103.786139, timestamp: 1430663266989};
        $scope.stores['metro_city_sq'] = {id: 'metro_city_sq', name: 'Metro City Sq', lat: 1.311333, lng: 103.856434, timestamp: 1430663266989};
        $scope.stores['events_atriums'] = {id: 'events_atriums', name: 'Events / Atriums', lat: 0, lng: 0, timestamp: 1430663266989};
        $scope.stores.$save();
    };

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
        var posOptions = {timeout: 5000, enableHighAccuracy: false};
        console.log("BRG Debug: showStoreList step3");
        stores_array = Stores.get_list_as_array();
        console.log(stores_array);

        if(stores_array.$loaded){
            stores_array.$loaded()
                .then(function() {
                    console.log("BRG Debug: stores_array loaded successfully");
                })
                .catch(function(err) {
                    console.error("BRG Debug: stores_array loaded failed" + err);
                    stores_array = Stores.get_list_as_array_offine();
                });
        }

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
