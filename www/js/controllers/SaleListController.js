angular.module('starter.controllers').controller('SaleListController', ["$scope", "$state", "$stateParams","$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "User", function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});

    var fItems;
    var fStores;

    setDate(new Date());

    //setStore();
    //
    // $ionicPopup.alert({
    //     title: 'Alert1',
    //     template: window.localStorage.getItem("store_date")
    // });
    if(window.localStorage.getItem('store_date') == $scope.date){
        $scope.store_id = window.localStorage.getItem('store_id');
        $scope.store_name = window.localStorage.getItem('store_name');
        updateSales();
    }else{
        $scope.showInitialStoreSelectMsg = true;
        showStoreList();
    }

    connectFirebase();
    //updateSales();
    //createInitialData();

    $scope.query = {
        text: '' 
    };

    $scope.new_item = {
        id: '',
        retail_price: ''
    }

    $scope.sale = {
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    // function setStore(){
    //     $scope.showInitialStoreSelectMsg = true;
    //     $scope.showManualAddSalePage1 = false;
    //     $scope.showManualAddSalePage2 = false;
    //     $scope.showStoreView = true;
    //     $scope.hideSalesView = true;
    // }

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
        updateSales();
    }

    function connectFirebase(){
        OfflineFirebase.restore();
        fStores = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/stores");
        fStores.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.stores = $firebaseObject(fStores);
        //refreshStoreArray();

        fItems = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/items");
        fItems.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.items = $firebaseObject(fItems);
        //refreshItemArray();
    }

    function updateSales(){
        var fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + $scope.store_id + "/" + $scope.year + "/" + $scope.month + "/" + $scope.day);
        fSales.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);

        $scope.sales = $firebaseArray(fSales);
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
