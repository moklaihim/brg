angular.module('starter.controllers').controller('SalesCtrl', ["$scope", "$state", "$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "User", function($scope, $state, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});

    setTodayDate();
    setStore();
    connectFirebase();
    updateSales();
    //createDummyData();
    
    function setStore(){
        //$scope.store_id = "bm_taka";
        //$scope.store_name = "BM@TAKA";
        $scope.showInitialStoreSelectMsg = true;
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = false;
        $scope.showStoreView = true;
        $scope.hideSalesView = true;
    }

    function setTodayDate(){
        var today=new Date(); 
        $scope.year = today.getFullYear();
        $scope.month = today.getMonth()+1;
        if ($scope.month < 10) { $scope.month = '0' + $scope.month; }
        $scope.day = today.getDate();
        if ($scope.day < 10) { $scope.day = '0' + $scope.day; }
        $scope.date = $scope.year + "/" + $scope.month + "/" + $scope.day;
    }

    function connectFirebase(){

        OfflineFirebase.restore();
        var fStores = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/stores");
        fStores.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.stores = $firebaseArray(fStores);

        var fItems = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/items");
        fItems.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.items = $firebaseArray(fItems);
    }

    function updateSales(){
        var fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + $scope.store_id + "/" + $scope.year + "/" + $scope.month + "/" + $scope.day);
        fSales.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.sales = $firebaseArray(fSales);
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

    $scope.showStoreList = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.stores = $firebaseArray(ref.child("stores"));
        //var syncObject = $firebaseObject(ref.child("stores"));
        //syncObject.$bindTo($scope, "stores");

        $scope.showInitialStoreSelectMsg = false;
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
        updateSales();
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
        if ($retail_price == 'new'){
            //Add item to DB
            var fNewItem = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + $item_id);
            var objNewItem = $firebaseObject(fNewItem);
            objNewItem.id = $item_id;
            objNewItem.$save();

        }
        $scope.item_id = $item_id;
        //$scope.sale_price = $retail_price;
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
            date: $scope.year + "/" + $scope.month + "/" + $scope.day,
            time: "12:30"
        });
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
                    $scope.item_id = barcodeData.text;
                    var fNewItem = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + barcodeData.text);
                    var objNewItem = $firebaseObject(fNewItem);
                    objNewItem.id = barcodeData.text;
                    objNewItem.$save();
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.hideSalesView = true;
        $scope.showManualAddSalePage2 = true;
    };
}])
