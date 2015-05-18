angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "$timeout", "$ionicPopup", "$ionicListDelegate", "Sales", "Items", function($scope, $state, $timeout, $ionicPopup, $ionicListDelegate, Sales, Items) {
    console.log("SaleListController started");
    $scope.current.view = 'sales_list';

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
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, key);
    }

    $scope.editSale = function(key) {
        console.log("Key clicked is : " + key) 
        $scope.current.item_key = key;
        $state.go('main.sales_add');
    }

    $scope.closeSales = function(){
        console.log("Close Sales");
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        updateSales();
    }

    $scope.reOpenSales = function(){
        console.log("ReOpenSales");
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day,"CLOSED");
        updateSales();
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
                        $scope.CloseStyle = {"background-color":"#ffc900", "border-color":"#e6b500"}
                    }else{
                        console.log("Has not Closed");
                        $scope.showSpinner = false;
                        $scope.salesClosed = false;
                        $scope.showClosedMessage = false;
                        $scope.CloseStyle = {"background-color":"#33cd5f", "border-color":"#28a54c"}
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });

            // $timeout(function(){
            //     console.log("BRG Debug: sales Timed out");
            //     Sales.on_timeout();
            //     $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            // }, 5000)

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

    // Alert Function----------------------------------------
    function showAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'hey!',
         template: 'over scroll '
        });
        alertPopup.then(function(res) {
         console.log('over scroll');
        });
    };
    $scope.showAlert = showAlert;


}])
