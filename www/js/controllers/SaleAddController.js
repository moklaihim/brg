angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$state", "$cordovaBarcodeScanner", "$cordovaDatePicker", "Items", "Sales", "Stores", function($scope, $state, $cordovaBarcodeScanner, $cordovaDatePicker, Items, Sales, Stores) {
    setDate(new Date());

    var current_store = Stores.get_current();
    console.log(current_store);
    if(Object.keys(current_store).length === 0){
        $state.go('main.stores_list');
    }
    if(Sales.check_sales()){
        Sales.get(current_store.id, $scope.year, $scope.month, $scope.day);
    }

    $scope.items = Items.get();
    $scope.items_array = Items.get_as_array();

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

    var current_item = Sales.get_current_item();
    console.log("Loaded Current Item: " + current_item);
    if(current_item){
        console.log("Current Item exist: " + current_item);
        selectItem(current_item);
    }else{
        $scope.showItemList = true;
    }

    function setDate(date){
        //var today=new Date(); 
        $scope.year = date.getFullYear();
        $scope.month = date.getMonth()+1;
        if ($scope.month < 10) { $scope.month = '0' + $scope.month; }
        $scope.day = date.getDate();
        if ($scope.day < 10) { $scope.day = '0' + $scope.day; }
        $scope.date = $scope.year + "/" + $scope.month + "/" + $scope.day;
        $scope.currentHr = date.getHours();
        $scope.currentMin = date.getMinutes();
        $scope.currentTime = $scope.currentHr + ":" + $scope.currentMin;
    }

    $scope.showDatePicker = function(){
    //$ionicPopup.alert({
    //    title: 'Alert2',
    //    template: window.localStorage.getItem("store_date")
    //});
        var options = {
            mode: 'date',
            date: new Date(),
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
            setDate(date);
        });
    };

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
        Sales.add($scope.sale.item_id, $scope.sale.sale_price, $scope.year, $scope.month, $scope.day, $scope.currentTime);
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
}])
