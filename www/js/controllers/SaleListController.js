angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "Sales", function($scope, $state, Sales) {
    console.log("SaleListController started");

    updateSales();
    $scope.showSalesView = true;

    $scope.removeSale = function(key) {
        console.log("remove key: " + key);
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, key);
    };

    $scope.closeSales = function(){
        console.log("Close Sales");
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        updateSales();
    }

    $scope.isRemoved = function(sale_id){
        console.log("isRemoved started");
        var removed_status = Sales.is_removed($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, sale_id);
        console.log("remove status for " + sale_id + ": " + removed_status);
        return removed_status;
    }

    function updateSales(){
        $scope.salesClosed = true;
        $scope.showSpinner = true;
        $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        if($scope.sales.$loaded){
            console.log("Loaded is there");
            $scope.sales.$loaded()
                .then(function() {
                    console.log($scope.sales);
                    if('CLOSED' in $scope.sales){
                        console.log("Already Closed");
                        $scope.showSpinner = false;
                        $scope.salesClosed = true;
                        $scope.showClosedMessage = true;
                    }else{
                        console.log("Has not Closed");
                        $scope.showSpinner = false;
                        $scope.salesClosed = false;
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }else{
            console.log("Loaded is not there");
            if('CLOSED' in $scope.sales){
                console.log("Already Closed");
                $scope.showSpinner = false;
                $scope.salesClosed = true;
                $scope.showClosedMessage = true;
            }else{
                console.log("Has not Closed");
                $scope.showSpinner = false;
                $scope.salesClosed = false;
            }

        }


        //console.log(Object.getOwnPropertyNames($scope.sales));
    }
    $scope.$on('changedDate', updateSales);
}])
