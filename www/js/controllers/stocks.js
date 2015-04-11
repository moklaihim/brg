angular.module('starter.controllers').controller('StockCtrl', ["$scope", "$state", "$ionicPlatform", "$firebaseArray", "User", function($scope, $state, $ionicPlatform, $firebaseArray, User) {

    $scope.store_id = "bm_taka";
    $scope.store_name = "BM@TAKA"
    $scope.date = "2-Apr-2015";
    updateStocks();
    //createDummyData();

    function createDummyData(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/stocks/bm_isetan_scotts");
        $scope.sales = $firebaseArray(ref);
        $scope.sales.$add({
            item: "R54321-BLU-35",
            qty: 4
        });
        $scope.sales.$add({
            item: "R56789-BRW-41",
            qty: 3
        });
    }

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
        /*
        $ionicPopup.alert({
            title: 'Alert',
            template: $store_id
        });
        */
        $scope.store_id = $store_id;
        $scope.store_name = $store_name;
        updateStocks();
        $scope.selectStoreView = false;
    }
}])
