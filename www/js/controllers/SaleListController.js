angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "Sales", function($scope, $state, Sales) {
    console.log("SaleListController started");

    $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
    console.log("Current Store" +  $scope.current.store_id + " " + $scope.current.store_name);

    $scope.removeSale = function(key) {
        console.log("remove key: " + key);
        Sales.remove(key);
    };

    $scope.$on('changedDate', function() {
        console.log("Started changedDate");
        $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
    });
}])
