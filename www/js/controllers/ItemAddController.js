angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$filter", "$state", "Items", function($scope, $filter, $state, Items) {
 
    $scope.new_item = {
        id: '',
        retail_price: ''
    } 

    $scope.new_item.id = $scope.current.item_id;

    $scope.ok = function(){
        Items.add($scope.new_item.id, $scope.new_item.retail_price);
        $scope.current.item_id = $scope.new_item.id;
        $state.go('main.sales_add');
    };

    $scope.cancel = function(){
        $scope.current.item_id ="";
        $state.go('main.sales_list');

    };

    $scope.$watch('new_item.id', function(val) {
        $scope.new_item.id = $filter('uppercase')(val);
    }, true);
}])
