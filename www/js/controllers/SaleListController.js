angular.module('starter.controllers').controller('SaleListController', ["$scope", "$state", "$stateParams","$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "Sales", function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, Sales) {
    setDate(new Date());

    if(window.localStorage.getItem('store_date') == $scope.date){
        $scope.store_id = window.localStorage.getItem('store_id')
        $scope.store_name = window.localStorage.getItem('store_name');
        $scope.sales = Sales.get($scope.store_id, $scope.year, $scope.month, $scope.day);
    }else{
        $scope.showInitialStoreSelectMsg = true;
        state.go('tab.sales-stores');
    }

    function setDate(date){
        //var today=new Date(); 
        $scope.year = date.getFullYear();
        $scope.month = date.getMonth()+1;
        if ($scope.month < 10) { $scope.month = '0' + $scope.month; }
        $scope.day = date.getDate();
        if ($scope.day < 10) { $scope.day = '0' + $scope.day; }
        $scope.date = $scope.year + "/" + $scope.month + "/" + $scope.day;
        $scope.currentHr = date.getHours();
        $scope.currentMin = date.getMinutes();
        $scope.currentTime = $scope.currentHr + ":" + $scope.currentMin;
        $scope.sales = Sales.get($scope.store_id, $scope.year, $scope.month, $scope.day);
    }

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

    $scope.manualAddSalePage1 = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.items = $firebaseArray(ref.child("items"));
        $scope.query.text = "";
        // $scope.showManualAddSalePage2 = false;
        // $scope.hideSalesView = true;
        // $scope.showManualAddSalePage1 = true;
        $state.go('tab.sales-m1');
    };

    $scope.removeSale = function (key) {
        $scope.sales.$remove(key).then(function(ref) {
            // data has been deleted locally and in Firebase
        }, function(error) {
            console.log("Error:", error);
        });
    }
}])
