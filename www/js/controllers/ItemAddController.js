angular.module('starter.controllers').controller('ItemAddController', ["$scope", "$state", "$stateParams","$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "User", function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, User) {
 
    $scope.new_item = {
        id: '',
        retail_price: ''
    } 

    $scope.manualAddItemPage1 = function(){
        $scope.new_item.id = '';
        $scope.new_item.retail_price = '';
        $state.go('tab.items_add');
        // $scope.showManualAddSalePage1 = false;
        // $scope.showManualAddItemPage1 = true;
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
        $state.go('tab.sales-m2');
        // $scope.showManualAddItemPage1 = false;
        // $scope.showManualAddSalePage2 = true;
    }

}])
