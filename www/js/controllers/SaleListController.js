angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "Sales", function($scope, $state, Sales) {
    console.log("SaleListController started");

    updateSales();

    $scope.removeSale = function(key) {
        console.log("remove key: " + key);
        Sales.remove(key);
    };

    $scope.closeSales = function(){
        console.log("Close Sales");
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        updateSales();
    }

    function updateSales(){
        $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        $scope.sales.$loaded()
            .then(function() {
                console.log($scope.sales);
                if('CLOSED' in $scope.sales){
                    console.log("Already Closed");
                    $scope.showCloseButton = false;
                    $scope.showAddButtons = false;
                }else{
                    console.log("Has not Closed");
                    $scope.showCloseButton = true;
                    $scope.showAddButtons = true;
                }
            })  
            .catch(function(err) {
                console.error(err);
            });

        //console.log(Object.getOwnPropertyNames($scope.sales));
    }
    $scope.$on('changedDate', updateSales);
}])
