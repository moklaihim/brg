angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $ionicGesture, $state, $filter, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {

    $scope.showDisOption = false;
    $scope.headerLabel = "SEARCH : ";
    $scope.headerCloseButton = true;
    $scope.searchButtons = true;

    $scope.query = {
        text: '' 
    };

    $scope.sale = {
        sale_key: '',
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.items_array = Items.get_as_array();
    $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);

    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';

    var brandbtns = ["HB", "F", "R", "H"];
    var colorbtns = ["BLK", "BLU", "GRN", "BRN"];
    var sizebtns = ["38", "39", "40", "41", "42", "43", "44", "45"];
    var allbtns = brandbtns.concat(colorbtns,sizebtns);

    if($state.current.name === "main.sales_scanadd"){
        //$scope.showItemList = false;
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    // var item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.current.item_id = barcodeData.text;
                        // showAlert($scope.current.item_id);
                        $state.go('main.items_add');
                    };
                    if ($scope.items.hasOwnProperty(barcodeData.text)){
                        selectItem(barcodeData.text);
                    };
                    if (barcodeData.cancelled){
                        $state.go('main.sales_list');
                    };
                },  function(error) {
                    // An error occurred
                    },
                    {
                        "showFlipCameraButton" : false
                    }
                );
        }); 
    };

    if($scope.current.today_date != $scope.current.set_date) {
        showAlert();
    }

    console.log("Loaded Current Item: " + $scope.current.item_id);
    if($scope.current.item_id){
        console.log("Current Item exist: " + $scope.current.item_id);
        selectItem($scope.current.item_id);
    }else if ($scope.current.item_key){
        console.log("Edit Item Key: " + $scope.current.item_id)
        editItem($scope.current.item_key);
    }else if ($state.current.name === "main.sales_scanadd"){
        $scope.showItemList = false;
    }else{
        $scope.showItemList = true;
    }

    $scope.showItemListPage = function(){
        $scope.showItemList = true;
        $scope.showSaleDetail = false;
        // $scope.hideSearchButtons = false;

    };

    function selectItem($item_id){
        console.log("sselectItem function called");
        $scope.headerCloseButton = false;
        $scope.searchButtons = false;
        $scope.hideQtyField = false;
        $scope.query.text = $item_id;
        $scope.headerLabel = "ADDING SALES : ";
        $scope.showItemList = false;
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = Number($scope.items[$item_id].retail_price);
        $scope.sale.qty = 1;
        $scope.showSaleDetail = true;
        $scope.hideSearchButtons = true;
    };
    $scope.selectItem = selectItem;

    function editItem($key){
        $scope.headerCloseButton = false;
        $scope.searchButtons = false;
        $scope.showItemList = false;
        $scope.hideQtyField = true;
        $scope.sales.$loaded().then(function(){
            $scope.sale.sale_key = $key;
            // $scope.query.text = $item_id;
            $scope.headerLabel = "EDITING SALES : ";
            $scope.sale.item_id = $scope.sales[$key].item;
            $scope.sale.sale_price = Number($scope.sales[$key].price);
            $scope.sale.retail_price = $scope.items[$scope.sale.item_id].retail_price;
            $scope.sale.discount_rate = 100 -($scope.sale.sale_price / $scope.sale.retail_price * 100);
            $scope.showSaleDetail = true;
        });
    };
    $scope.selectItem = selectItem;

    $scope.cancel = function(){
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        if ($scope.sale.sale_key){
            // console.log("Sale_key got result in saleController.js")
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.sale.sale_key);
        }else {
            for (var i = 0; i < $scope.sale.qty; i++) {
                console.log("Sale_key FAIL in Sales.js")
                Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, false);
            }
        }
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $state.go('main.sales_list');
    };

    $scope.addItem = function(){
        $scope.current.item_id = $scope.query.text;
        $state.go('main.items_add');
    }

    $scope.dOption= function(){
        $scope.showDisOption = !$scope.showDisOption;
        console.log("button clicked");
    };

    $scope.dButton= function(event){
        var disc = event.target.id;
        $scope.showDisOption = !$scope.showDisOption;
        $scope.sale.discount_rate = disc;
        $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * disc / 100;

    };

    $scope.$watch('query.text', function(val) {
        $scope.query.text = $filter('uppercase')(val);
    }, true);

    $scope.btn_brand= function(event){
                
        for (btn in brandbtns) {
            if (brandbtns[btn] == event.target.id){
                document.getElementById(brandbtns[btn]).className = "button active";
                $scope.item_brand = brandbtns[btn];
            }
            else{
                document.getElementById(brandbtns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_code= function(event){
        $scope.item_code = $scope.item_code + event.target.id;
        itemId();
    };

    $scope.btn_color= function(event){
        
        $scope.ClearBg = {};
        for (btn in colorbtns) {
            if (colorbtns[btn] == event.target.id){
                document.getElementById(colorbtns[btn]).className = "button active";
                $scope.item_color = colorbtns[btn];
            }
            else{
                document.getElementById(colorbtns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_size= function(event){
        
        $scope.ClearBg = {};
        for (btn in sizebtns) {
            if (sizebtns[btn] == event.target.id){
                document.getElementById(sizebtns[btn]).className = "button active";
                $scope.item_size = sizebtns[btn];
            }
            else{
                document.getElementById(sizebtns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_price= function(event){
        $scope.new_item.retail_price = $scope.new_item.retail_price + event.target.id;
    };

    $scope.itemIdClear= function(){
        $scope.item_brand = '';
        $scope.item_code ='';
        $scope.item_color ='';
        $scope.item_size = '';
        for (btn in allbtns) {
            document.getElementById(allbtns[btn]).className = "button";
        }

        itemId();
    };

    function itemId(){
        $scope.query.text = $scope.item_brand + $scope.item_code + $scope.item_color + $scope.item_size;
    };
    $scope.itemId = itemId;


    var searchItem = angular.element(document.querySelector('#searchItem'));
    $ionicGesture.on('tap', function(e) {
        $scope.hideSearchButtons = !$scope.hideSearchButtons;
        $scope.$digest();
    }, searchItem);

    $scope.doRefresh = function() {
        $state.go("main.sales_scanadd");
        $scope.$broadcast('scroll.refreshComplete');
    };

    // Alert Function----------------------------------------
    function showAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'Warning!',
         template: 'You are not entering sales for today\'s date'
        });
        alertPopup.then(function(res) {
         console.log('Thank you for different date');
        });
    };
    $scope.showAlert = showAlert;

}])
