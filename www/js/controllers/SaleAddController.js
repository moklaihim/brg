angular.module('starter.controllers').controller('SaleAddController', ["$scope", "$state", "$stateParams","$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "User", function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, User) {
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
        refreshItemArray();
    }

    function refreshItemArray(){
        $scope.items_array = $firebaseArray(fItems);
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

    $scope.manualAddSalePage2 = function($item_id){
        // $scope.item = "testing123";
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = '';
        $scope.sale.qty = 1;
        // console.log({{sale.item_id}});
        // $scope.showManualAddSalePage1 = false;
        // $scope.showManualAddSalePage2 = true;
        $state.go('tab.sales-m2');

    };

    $scope.manualAddSaleCancel = function(){
        $scope.showManualAddSalePage2 = false;
        $scope.showManualAddSalePage1 = true;
        // $scope.hideSalesView = false;
    };

    $scope.manualAddSelectCancel = function(){
        $scope.showManualAddSalePage1 = false;
        $scope.hideSalesView = false;
    };

    $scope.manualAddSaleOK = function(){
        //$scope.sale_price = $sale_price;
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
        $scope.sales.$add({
            item: $scope.sale.item_id,
            price: $scope.sale.sale_price,
            date: $scope.year + "/" + $scope.month + "/" + $scope.day,
            time: $scope.currentTime
        });
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = false;
    };

    $scope.scanAddSalePage1 = function(){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    $scope.item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.items[$item_id] = {id: $item_id};
                        $scope.items.$save();
                        refreshItemArray();
                    };
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.hideSalesView = true;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.manualAddItemPage1 = function(){
        $scope.new_item.id = '';
        $scope.new_item.retail_price = '';
        $state.go('tab.sales-additem');
        // $scope.showManualAddSalePage1 = false;
        // $scope.showManualAddItemPage1 = true;
    }

}])
