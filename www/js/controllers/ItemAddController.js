angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$state", "Items", function($scope, $state, Items) {
 
    $scope.new_item = {
        id: '',
        retail_price: ''
    } 

    $scope.ok = function(){
        Items.add($scope.new_item.id, $scope.new_item.retail_price);
        $scope.current.item_id = $scope.new_item.id;
        $state.go('main.sales_add');
    }

    $scope.cancel = function(){
        $state.go('main.sales_list');
    };
}])
