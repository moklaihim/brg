angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$state", "Items", "Sales", function($scope, $state, Items, Sales) {
 
    $scope.new_item = {
        id: '',
        retail_price: ''
    } 

    $scope.ok = function(){
        Items.add($scope.new_item.id, $scope.new_item.retail_price);
        Sales.set_current_item($scope.new_item.id);
        var current_item = Sales.get_current_item();
        console.log("Saved Current Item: " + current_item);
        $state.go('tab.sales_add');
    }

    $scope.cancel = function(){
        $state.go('tab.sales_list');
    };
}])
