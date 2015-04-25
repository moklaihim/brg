angular.module('starter.controllers').controller('StockCtrl', ["$scope", "$state", "$ionicPopup", "$ionicPlatform", "$firebaseArray", "$firebaseObject", "User", function($scope, $state, $ionicPopup, $ionicPlatform, $firebaseArray, $firebaseObject, User) {

    $scope.store_id = "bm_taka";
    $scope.store_name = "BM@TAKA";
    $scope.date = "2-Apr-2015";
    // updateStocks();
    //createDummyData();

    connectFirebase();

    function connectFirebase(){
        $scope.stores = $firebaseArray(new Firebase("https://fiery-heat-6039.firebaseio.com/stores"));
        $scope.items = $firebaseArray(new Firebase("https://fiery-heat-6039.firebaseio.com/items"));
        // var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/stocks/bm_taka");
        $scope.stocks = $firebaseArray(ref);
    }

    // function createDummyData(){
    //     var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/stocks/bm_isetan_scotts");
    //     $scope.sales = $firebaseArray(ref);
    //     $scope.sales.$add({
    //         item: "R54321-BLU-35",
    //         qty: 4
    //     });
    //     $scope.sales.$add({
    //         item: "R56789-BRW-41",
    //         qty: 3
    //     });
    // }

    function updateStocks(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.stocks = $firebaseArray(ref.child("stocks/" + $scope.store_id));
    }

    $scope.showStoreList = function(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.stores = $firebaseArray(ref.child("stores"));
        //var syncObject = $firebaseObject(ref.child("stores"));
        //syncObject.$bindTo($scope, "stores");

        $scope.selectStoreView = true;
    }

    $scope.selectStore = function($store_id, $store_name){
        
        $scope.store_id = $store_id;
        $scope.store_name = $store_name;
        updateStocks();
        $scope.selectStoreView = false;
    }

     $scope.manualAddStockPage1 = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.items = $firebaseArray(ref.child("items"));

        $scope.hideStockView = true;
        $scope.showManualAddStockPage1 = true;

    };

    $scope.manualAddStockPage2 = function($item_id){
        $scope.item_id = $item_id;
        // $scope.item_qty = $item_qty;
        $scope.showManualAddStockPage1 = false;
        $scope.showManualAddStockPage2 = true;
    };

    $scope.manualAddStockOK = function($item_qty){
        $scope.item_qty = $item_qty;
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
        $scope.stocks.child(1).$add({
            item: $scope.item_id,
            qty: $scope.item_qty,
        });
        $scope.showManualAddStockPage2 = false;
        $scope.hideStockView = false;
    };

    $scope.plusItem = function($key, $qty){
        $scope.stocks.$id = $key;
        $scope.stocks.qty = $qty;
        var item = $scope.stocks.$getRecord($scope.stocks.$id);
  		item.qty = $qty + 1;
        
        $ionicPopup.alert({
            title: 'Alert',
            template: item.qty
        });

        $scope.stocks.$save(item).then(function(){});  
    };

    $scope.minusItem = function($key, $qty){
        $scope.stocks.$id = $key;
        $scope.stocks.qty = $qty;
        var item = $scope.stocks.$getRecord($scope.stocks.$id);
  		item.qty = $qty - 1;
        
        $ionicPopup.alert({
            title: 'Alert',
            template: item.qty
        });

        $scope.stocks.$save(item).then(function(){});  
    };
}])
