angular.module('starter.controllers').controller('SalesCtrl', ["$scope", "$state", "$ionicPopup", "$ionicPlatform", "$firebaseArray", "$cordovaBarcodeScanner", "User", function($scope, $state, $ionicPopup, $ionicPlatform, $firebaseArray, $cordovaBarcodeScanner, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});
    $scope.store_id = "bm_taka";
    $scope.store_name = "BM@TAKA";
    $scope.date = "2-Apr-2015";

    connectFirebase();
    //updateSales();
    //createDummyData();

    function connectFirebase(){

        OfflineFirebase.restore();
        var fStores = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/stores");
        fStores.on('value', function(snapshot) {
            console.log(snapshot.val());
        }, undefined, undefined, true);

        var fItems = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/items");
        fItems.on('value', function(snapshot) {
            console.log(snapshot.val());
        }, undefined, undefined, true);

        $scope.stores = $firebaseArray(fStores);
        $scope.items = $firebaseArray(fItems);

        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
    }

    function createDummyData(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/bm_isetan_scotts");
        $scope.sales = $firebaseArray(ref);
        $scope.sales.$add({
            item: "R54321-BLU-39",
            price: "99",
            date_time: "1-Apr-2015 12:30"
        });
        $scope.sales.$add({
            item: "R56789-BRW-43",
            price: "130",
            date_time: "1-Apr-2015 16:50"
        });
    };

    function updateSales(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
    };

    $scope.showStoreList = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.stores = $firebaseArray(ref.child("stores"));
        //var syncObject = $firebaseObject(ref.child("stores"));
        //syncObject.$bindTo($scope, "stores");

        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = false;
        $scope.showStoreView = true;
        $scope.hideSalesView = true;
    };

    $scope.selectStore = function($store_id, $store_name){
        /*
        $ionicPopup.alert({
            title: 'Alert',
            template: $store_id
        });
        */
        $scope.store_id = $store_id;
        $scope.store_name = $store_name;
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
        //updateSales();
        $scope.showStoreView = false;
        $scope.hideSalesView = false;
    };

    $scope.manualAddSalePage1 = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.items = $firebaseArray(ref.child("items"));
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = true;
        $scope.showManualAddSalePage1 = true;
    };

    $scope.manualAddSalePage2 = function($item_id, $retail_price){
        $scope.item_id = $item_id;
        $scope.sale_price = $retail_price;
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.manualAddSaleOK = function($sale_price){
        $scope.sale_price = $sale_price;
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
        $scope.sales.$add({
            item: $scope.item_id,
            price: $scope.sale_price,
            date_time: "1-Apr-2015 12:30"
        });
        //updateSales();
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = false;
    };

    $scope.manualAddCancel = function(){
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = false;
    };

    $scope.scanAddSalePage1 = function(){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    // Success! Barcode data is here
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: barcodeData
                    });
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.hideSalesView = true;
        $scope.showScanAddSalePage1 = true;
    };
}])
