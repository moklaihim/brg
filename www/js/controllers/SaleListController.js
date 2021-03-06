angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "Sales", "Users", "Env", "Logging", "$ionicListDelegate", "$ionicModal", function($scope, $state, Sales, Users, Env, Logging, $ionicListDelegate, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/sales_list_report_view.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    console.log("BRG Debug: SaleListController started");
    Logging.log2FB($scope.user_detail.email, "SaleListController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('SaleListController');
    //}
    $scope.current.view = 'sales_list';
    $scope.current.showAddItemBtn = '';

    $scope.getStore();
    $scope.users= Users.get_list();

    updateSales();
    $scope.showSalesView = true;

    console.log("nearest store is " + $scope.current.nearestStore);
    console.log("selected store is " + $scope.current.store_id);

    $scope.add = function(){
        Logging.log2FB($scope.user_detail.email, "starts add function in SaleListController");
        $scope.current.itemAddMode='fromsale'
        Logging.log2FB($scope.user_detail.email, "ends add function in SaleListController");
        $state.go('main.items_list');
    }

    $scope.getNameByEmail = function(email){
        // Logging.log2FB($scope.user_detail.email, "starts getNameByEmail function in SaleListController");
        var user_id = email.replace("@", "_").replace(/\./g, "_");
        if($scope.users[user_id]){
            return $scope.users[user_id].name;
        }
        // Logging.log2FB($scope.user_detail.email, "ends getNameByEmail function in SaleListController");
    }

    $scope.removeSale = function(key) {
        Logging.log2FB($scope.user_detail.email, "starts removeSale function in SaleListController");
        console.log("remove key: " + key);
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, key);
        updateSales();
        Logging.log2FB($scope.user_detail.email, "ends removeSale function in SaleListController");
    }

    $scope.editSale = function(key) {
        Logging.log2FB($scope.user_detail.email, "starts editSale function in SaleListController");
        console.log("Key clicked is : " + key) 
        $scope.current.item_key = key;
        $state.go('main.sales_add');
        Logging.log2FB($scope.user_detail.email, "ends editSale function in SaleListController");
    }

    $scope.closeSales = function(){
        Logging.log2FB($scope.user_detail.email, "starts closeSales function in SaleListController");
        console.log("Close Sales");
        Sales.close($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.user_detail.email);
        updateSales();
        Logging.log2FB($scope.user_detail.email, "ends closeSales function in SaleListController");
    }

    $scope.reOpenSales = function(){
        Logging.log2FB($scope.user_detail.email, "starts reOpenSales function in SaleListController");
        console.log("ReOpenSales");
        Sales.remove($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day,"CLOSED");
        updateSales();
        // $state.go($state.current, {}, {reload: true});
        // $window.location.reload(true);
        // $ionicListDelegate.closeOptionButtons();
        Logging.log2FB($scope.user_detail.email, "ends reOpenSales function in SaleListController");
    }

    function updateSales(){
        Logging.log2FB($scope.user_detail.email, "starts updateSales function in SaleListController");
        console.log("updateSales started");
        console.log("User store is" + $scope.user_detail.storeIC);
        if($scope.current.store_id != ''){
            $scope.showSelectStoreMsg = false;
            $scope.showSpinner = true;
            var p_sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            p_sales.then(function(sales_detail){
                $scope.sales = sales_detail;
                $scope.brand_qtys = new Object();
                $scope.brand_totals = new Object();
                $scope.brand_sums = new Object();
                $scope.totalSalesQty = 0;
                $scope.totalSalesPrice = 0;
                angular.forEach($scope.sales, function(sale, key) {
                  if(key != "CLOSED"){
                    var brand = sale.item.slice(0, sale.item.search(/\d/));
                    var brand_id = brand.toLowerCase();
                    if(brand_id == "sf"){
                      brand_id = "f";
                    }else if(brand_id == "sh"){
                      brand_id = "h";
                    }   

                    if(!(brand_id in $scope.brand_sums)){
                      $scope.brand_sums[brand_id] = new Object();
                      $scope.brand_sums[brand_id]['qty'] = 0;
                      $scope.brand_sums[brand_id]['total'] = 0;
                    }

                    $scope.brand_sums[brand_id]['qty']++;
                    $scope.brand_sums[brand_id]['total'] += Number(sale.price);
                    $scope.brand_sums[brand_id]['total'] = Math.floor($scope.brand_sums[brand_id]['total'] * 100 + 0.5)/100;

                    $scope.totalSalesQty++;
                    $scope.totalSalesPrice += Number(sale.price);
                    $scope.totalSalesPrice = Math.floor($scope.totalSalesPrice * 100 + 0.5)/100;
                    console.log("Total price is = " + Number($scope.totalSalesPrice));
                  }
                });

                // var count = Object.keys($scope.sales).length; //to count and show total sales                
                // console.log("Total Sales Qty is = " + (count-3))

                if('CLOSED' in $scope.sales){
                    $scope.showSpinner = false;
                    $scope.salesClosed = true;
                    $ionicListDelegate.canSwipeItems(false);
                    //$scope.totalSalesQty--;
                    // $scope.CloseStyle = {"background-color":"#ffc900", "border-color":"#e6b500"}
                }else{
                    $scope.showSpinner = false;
                    $scope.salesClosed = false;
                    $ionicListDelegate.canSwipeItems(true);
                    //$scope.totalSalesQty = count -3;
                    // $scope.CloseStyle = {"background-color":"#33cd5f", "border-color":"#28a54c"}
                }
            });
        }else{
            $scope.showSelectStoreMsg = true;
        }
        Logging.log2FB($scope.user_detail.email, "ends updateSales function in SaleListController");
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

    // var close_watch = $scope.$watch('sales.CLOSED', function(val){
        
    //     console.log("Sales changed");
        
    //     if($scope.salesClosed){
    //         console.log("sale is already closed");
    //         if(!('CLOSED' in $scope.sales)){
    //             console.log("Open detected");
    //             updateSales();
    //        }
    //     }else if($scope.sales && 'CLOSED' in $scope.sales){
    //        console.log("Close detected");
    //        updateSales();
    //     }
        
    // }, false);

}])
