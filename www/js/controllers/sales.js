angular.module('starter.controllers').controller('SalesCtrl', ["$scope", "$state", "$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "User", function($scope, $state, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});

    var fItems;

    setTodayDate();
    setStore();
    connectFirebase();
    updateSales();
    //createDummyData();

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
        $scope.stores = $firebaseObject(fStores);

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
        $scope.query.text = "";
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = true;
        $scope.showManualAddSalePage1 = true;
    };

    $scope.manualAddSalePage2 = function($item_id){
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = '';
        $scope.sale.qty = 1;
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.manualAddSaleCancel = function(){
        $scope.showManualAddSalePage2 = false;
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
            time: "12:30"
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
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddItemPage1 = true;
    }

    $scope.manualAddItemOK = function(){
        //console.log("manualAddItemOK Started");
        //console.log($scope.new_item.item_id);
        $scope.items[$scope.new_item.id] = {id: $scope.new_item.id, retail_price: $scope.new_item.retail_price};
        $scope.items.$save();
        refreshItemArray();

        $scope.sale.item_id = $scope.new_item.id;
        $scope.sale.retail_price = $scope.new_item.retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale_price = '';
        $scope.sale.qty = 1;
        $scope.showManualAddItemPage1 = false;
        $scope.showManualAddSalePage2 = true;
    }
}])
