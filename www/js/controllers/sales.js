angular.module('starter.controllers').controller('SalesCtrl', ["$scope", "$state", "$ionicPlatform", "$firebaseArray", "User", function($scope, $state, $ionicPlatform, $firebaseArray, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});
    $store_id = "bm_taka";
    var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
    $scope.sales = $firebaseArray(ref.child("sales/" + $store_id));
    //$scope.stores = $firebaseArray(ref.child("stores"));
    //$scope.stores.$add({

    /*
    $scope.sales.$add({
      item: "R31006-BLU-39",
      price: "109",
      date_time: "1-Apr-2015 12:30"
    });
    $scope.sales.$add({
      item: "R31012-BLK-41",
      price: "93",
      date_time: "1-Apr-2015 13:22"
    });
    $scope.sales.$add({
      item: "R31010-BRW-43",
      price: "109",
      date_time: "1-Apr-2015 16:50"
    });
    */
    $scope.date = "2-Apr-2015";
  //};

    $scope.showStoreList = function(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        $scope.stores = $firebaseArray(ref.child("stores"));
        //var syncObject = $firebaseObject(ref.child("stores"));
        //syncObject.$bindTo($scope, "stores");

        $scope.selectStoreView = true;
    }
}])
