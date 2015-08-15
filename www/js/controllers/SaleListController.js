angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "Sales", "Users", "Env", function($scope, $state, Sales, Users, Env) {
    console.log("BRG Debug: SaleListController started");
    $scope.current.view = 'sales_list';
    $scope.current.showAddItemBtn = '';


    $scope.getStore();
    $scope.users= Users.get_list();

    updateSales();
    $scope.showSalesView = true;

    console.log("nearest store is " + $scope.current.nearestStore);
    console.log("selected store is " + $scope.current.store_id);

    $scope.getNameByEmail = function(email){
        var user_id = email.replace("@", "_").replace(/\./g, "_");
        if($scope.users[user_id]){
            return $scope.users[user_id].name;
        }
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
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.user_detail.email);
        updateSales();
    }

    $scope.reOpenSales = function(){
        console.log("ReOpenSales");
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day,"CLOSED");
        updateSales();
    }

    function updateSales(){
        console.log("updateSales started");
        console.log("User store is" + $scope.user_detail.storeIC);
        if($scope.current.store_id != ''){
            $scope.showSelectStoreMsg = false;
            $scope.showSpinner = true;
            var p_sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            p_sales.then(function(sales_detail){
                $scope.sales = sales_detail;
                // var count = Object.keys($scope.sales).length; //to count and show total sales
                // console.log("Total Sales Qty is = " + (count-3))

                if('CLOSED' in $scope.sales){
                    $scope.showSpinner = false;
                    $scope.salesClosed = true;
                    // $scope.totalSalesQty = count -4;
                    // $scope.CloseStyle = {"background-color":"#ffc900", "border-color":"#e6b500"}
                }else{
                    $scope.showSpinner = false;
                    $scope.salesClosed = false;
                    // $scope.totalSalesQty = count -3;
                    // $scope.CloseStyle = {"background-color":"#33cd5f", "border-color":"#28a54c"}
                }
            });
        }else{
            $scope.showSelectStoreMsg = true;
        }
    }
    

    $scope.$on('changedDate', updateSales);

    var online_watch = $scope.$watch(Env.isOnline, function(val){
        console.log("isOnline changed");
        if(val == true){
            console.log("become Online");
            $scope.users= Users.get_list();
            console.log("starting updateSales");
            updateSales();
            console.log("starting online_watch");
            online_watch();
        }
    }, false);
   
   
    var close_watch = $scope.$watch('sales.CLOSED', function(val){
        
        console.log("Sales changed");
        
        if($scope.salesClosed){
            console.log("sale is already closed");
            if(!('CLOSED' in $scope.sales)){
                console.log("Open detected");
                updateSales();
           }
        }else if($scope.sales && 'CLOSED' in $scope.sales){
           console.log("Close detected");
           updateSales();
        }
        
    }, false);

}])
