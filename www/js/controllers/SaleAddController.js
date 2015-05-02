angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$state", "$cordovaBarcodeScanner", "Items", "Sales", function($scope, $state, $cordovaBarcodeScanner, Items, Sales) {

    $scope.showDisOption = false;

    $scope.query = {
        text: '' 
    };

    $scope.sale = {
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.items_array = Items.get_as_array();

    if(Sales.check_sales()){
        Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
    }

    console.log("Loaded Current Item: " + $scope.current.item_id);
    if($scope.current.item_id){
        console.log("Current Item exist: " + $scope.current.item_id);
        selectItem($scope.current.item_id);
    }else{
        $scope.showItemList = true;
    }

    $scope.showItemListPage = function(){
        $scope.showItemList = true;
        $scope.showSaleDetail = false;
    };

    function selectItem($item_id){
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = $scope.items[$item_id].retail_price;
        $scope.sale.qty = 1;
        $scope.showItemList = false;
        $scope.showSaleDetail = true;
    };
    $scope.selectItem = selectItem;

    $scope.cancel = function(){
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        if (minute < 10) { minute = '0' + minute; }
        var time = hour + ':' + minute;

        Sales.add($scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, time);
        $state.go('main.sales_list');
    };

    $scope.addItem = function(){
        $state.go('main.items_add');
    }

    $scope.scanAddSalePage1 = function(){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    $scope.item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.items[$item_id] = {id: $item_id};
                        $scope.items.$save();
                        refreshItemArray();
                    };
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.hideSalesView = true;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.dOption= function(){
        $scope.showDisOption = !$scope.showDisOption;
        console.log("button clicked");
    };

}])
