angular.module('starter.controllers').controller('StoreListController', ["$scope", "$state", "$stateParams","$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "Stores", function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, Stores) {
    // showStoreList();

    $scope.stores = Stores.get();
    $scope.stores_array = Stores.get_as_array($stateParams.storeId);

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
        // $scope.hideSalesView = true;
        $scope.showSpinner = true;
        var posOptions = {timeout: 5000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                //console.log(lat + " " + lng + " OK");
                for (var i = 0; i < $scope.stores_array.length; i++) {
                    $scope.stores_array[i].distance = Math.round(distance(lat, lng, $scope.stores_array[i].lat, $scope.stores_array[i].lng, "K")*1000);
                    if($scope.stores_array[i].distance > 1000){
                        $scope.stores_array[i].distance_disp = Math.round($scope.stores_array[i].distance / 100) / 10 + "km";
                    }else{
                        $scope.stores_array[i].distance_disp = $scope.stores_array[i].distance + "m";
                    }
                    // console.log($scope.stores_array[i].name + " " + $scope.stores_array[i].distance_disp + " OK");
                }
                $scope.showSpinner = false;
                // $scope.showManualAddSalePage1 = false;
                // $scope.showManualAddSalePage2 = false;
                // $scope.showStoreView = true;
                // $state.go('tab.sales-stores');
                // $state.refresh('tab.sales-stores');
                // $state.transitionTo('tab.sales-stores', null, {'reload':true});
            }, function(err) {
                $scope.showSpinner = false;
                // $scope.showManualAddSalePage1 = false;
                // $scope.showManualAddSalePage2 = false;
                // $scope.showStoreView = true;
                // $state.go('tab.sales-stores');
                // $state.refresh('tab.sales-stores');
                // $state.transitionTo('tab.sales-stores', null, {'reload':true});
            });
    }
    $scope.showStoreList = showStoreList;

    $scope.showDatePicker = function(){
    //$ionicPopup.alert({
    //    title: 'Alert2',
    //    template: window.localStorage.getItem("store_date")
    //});
        var options = {
            mode: 'date',
            date: new Date(),
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
            setDate(date);
        });
    };

    $scope.selectStore = function($store_id, $store_name){
        
        $scope.store_id = $store_id;
        $scope.store_name = $store_name;
        // updateSales();
        var today=new Date(); 
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        if (month < 10) { month = '0' + month; }
        var day = today.getDate();
        if (day < 10) { day = '0' + day; }
        var date = year + "/" + month + "/" + day;

        window.localStorage.setItem("store_date", date);
        window.localStorage.setItem("store_id", $store_id);
        window.localStorage.setItem("store_name", $store_name);

        $state.go('tab.sale-list');

    // // $ionicPopup.alert({
    // //     title: 'Alert3',
    // //     template: window.localStorage.getItem("store_date")
    // // });
    //     // $scope.showInitialStoreSelectMsg = false;
    //     // $scope.showStoreView = false;
    //     // $scope.hideSalesView = false;
    //     // $scope.showInitialStoreSelectMsg = false;
    };
}])
