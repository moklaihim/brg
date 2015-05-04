angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "$ionicListDelegate", "Sales", "Items", function($scope, $state, $ionicListDelegate, Sales, Items) {
    console.log("SaleListController started");

    updateSales();
    $scope.showDisOption = false;
    $scope.showSalesView = true;

    $scope.sale = {
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.removeSale = function(key) {
        console.log("remove key: " + key);
        Sales.remove(key);
    };

    $scope.editSale = function(key) {
        $scope.sale.key = key;
        var AllItems = Items.get();
        var retailP = AllItems[$scope.sales[key].item].retail_price;
        $scope.showSalesView = false;
        $scope.showEditSaleDetail = true;
        $scope.salesClosed = true;
        $scope.showEditBtns = true;
        $scope.sale.item_id = $scope.sales[key].item;
        $scope.sale.retail_price = retailP;
        $scope.sale.sale_price = $scope.sales[key].price;
    };

    $scope.dOption= function(){
        $scope.showDisOption = !$scope.showDisOption;
        // console.log("button clicked");
    };

    $scope.editSaleUpdateBtn= function(){
        // console.log("update clicked");
        // console.log("key is"+$scope.sale.key);
        Sales.save($scope.sale.key,$scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        // $ionicListDelegate.closeOptionButtons();
        $scope.showSalesView = true;
        $scope.showEditSaleDetail = false;
        $scope.salesClosed = false;
        $scope.showEditBtns = false;
        updateSales();
    };

    $scope.editSaleCancelBtn= function(){
        // console.log("cancel clicked");
        $scope.showSalesView = true;
        $scope.showEditSaleDetail = false;
        $scope.salesClosed = false;
        $scope.showEditBtns = false;
        updateSales();
    };

    $scope.closeSales = function(){
        console.log("Close Sales");
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        updateSales();
    }

    function updateSales(){
        $scope.salesClosed = true;
        $scope.showSpinner = true;
        $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
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

        //console.log(Object.getOwnPropertyNames($scope.sales));
    }
    $scope.$on('changedDate', updateSales);
}])
