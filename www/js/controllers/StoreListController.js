angular.module('starter.controllers')
.controller('StoreListController', ["$scope", "$state", "$cordovaGeolocation", "Stores", function($scope, $state, $cordovaGeolocation, Stores) {

    //$scope.stores_array = Stores.get_as_array($stateParams.storeId);
    $scope.stores = Stores.get_list();
    showStoreList();
    //createInitialData();

    function createInitialData(){
        $scope.stores['taka'] = {id: 'taka', name: 'TAKA', lat: 1.302479, lng: 103.834615};
        $scope.stores['isetan_scotts'] = {id: 'isetan_scotts', name: 'ISETAN SCOTTS', lat: 1.305732, lng: 103.8315};
        $scope.stores['isetan_tmp'] = {id: 'isetan_tmp', name: 'ISETAN TMP', lat: 1.352492, lng: 103.944797};
        $scope.stores['isetan_nex'] = {id: 'isetan_nex', name: 'ISETAN NEX', lat: 1.305589, lng: 103.831510};
        $scope.stores['isetan_katong'] = {id: 'isetan_katong', name: 'ISETAN KATONG', lat: 1.301547, lng: 103.904688};
        $scope.stores['isetan_westgate'] = {id: 'isetan_westgate', name: 'ISETAN WESTGATE', lat: 1.334033, lng: 103.742837};
        $scope.stores['robs_rc'] = {id: 'robs_rc', name: 'Robs RC', lat: 1.293775, lng: 103.852741};
        $scope.stores['robs_orch'] = {id: 'robs_orch', name: 'Robs Orch', lat: 1.302399, lng: 103.837175};
        $scope.stores['robs_jem'] = {id: 'robs_jem', name: 'Robs JEM', lat: 1.333381, lng: 103.743388};
        $scope.stores['tangs_orch'] = {id: 'tangs_orch', name: 'Tangs Orch', lat: 1.304975, lng: 103.832957};
        $scope.stores['tangs_vivo'] = {id: 'tangs_vivo', name: 'Tangs Vivo', lat: 1.264797, lng: 103.822047};
        $scope.stores['bhg_bugis'] = {id: 'bhg_bugis', name: 'BHG Bugis', lat: 1.300001, lng: 103.855588};
        $scope.stores['metro_paragon'] = {id: 'metro_paragon', name: 'Metro Paragon', lat: 1.303753, lng: 103.835716};
        $scope.stores['metro_woodlands'] = {id: 'metro_woodlands', name: 'Metro Woodlands', lat: 1.435820, lng: 103.786139};
        $scope.stores['metro_city_sq'] = {id: 'metro_city_sq', name: 'Metro City Sq', lat: 1.311333, lng: 103.856434};
        $scope.stores['events_atriums'] = {id: 'events_atriums', name: 'Events / Atriums', lat: 0, lng: 0};
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
        var stores_array = Stores.get_list_as_array();
        $scope.showSpinner = true;
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
                $scope.showSpinner = false;
                $scope.stores_array = stores_array;
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

        console.log("CurrentStore set to id: " + $scope.current.store_id + " name: " + $scope.current.store_name);
        $state.go('main.sales_list');
    };

}])
