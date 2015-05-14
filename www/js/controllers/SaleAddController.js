angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $ionicGesture, $state, $filter, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {

    $scope.showDisOption = false;
    // $scope.showSearchHeader = true;


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

    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';

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

    $scope.cancel = function(){
        $scope.current.item_id = "";
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        for (var i = 0; i < $scope.sale.qty; i++) {
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        }
        $scope.current.item_id = "";
        $state.go('main.sales_list');
    };

    $scope.addItem = function(){
        $scope.current.item_id = $scope.query.text;
        $state.go('main.items_add');
    }

    // $scope.scanAddSalePage1 = function(){
    //     $ionicPlatform.ready(function(){
    //         $cordovaBarcodeScanner
    //             .scan()
    //             .then(function(barcodeData) {
    //                 $scope.item_id = barcodeData.text;
    //                 if (!$scope.items.hasOwnProperty(barcodeData.text)){
    //                     $scope.items[$item_id] = {id: $item_id};
    //                     $scope.items.$save();
    //                     refreshItemArray();
    //                 };
    //             }, function(error) {
    //                 // An error occurred
    //             });
    //     });
    //     $scope.showSalesView = false;
    //     $scope.showManualAddSalePage2 = true;
    // };

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
        var btns = ["HB", "F", "R", "H"];
        
        for (btn in btns) {
            if (btns[btn] == event.target.id){
                document.getElementById(btns[btn]).className = "button active";
                $scope.item_brand = btns[btn];
            }
            else{
                document.getElementById(btns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_code= function(event){
        $scope.item_code = $scope.item_code + event.target.id;
        itemId();
    };

    $scope.btn_color= function(event){
        var btns = ["BLK", "BLU", "GRN", "BRN"];
        for (btn in btns) {
            if (btns[btn] == event.target.id){
                document.getElementById(btns[btn]).className = "button active";
                $scope.item_color = btns[btn];
            }
            else{
                document.getElementById(btns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_size= function(event){
        var btns = ["38", "39", "40", "41", "42", "43", "44", "45"];
        for (btn in btns) {
            if (btns[btn] == event.target.id){
                document.getElementById(btns[btn]).className = "button active";
                $scope.item_size = btns[btn];
            }
            else{
                document.getElementById(btns[btn]).className = "button";
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
        $scope.brandBtn='';
        $scope.colorBtn='';
        $scope.sizeBtn='';
        $scope.ClearBg = {"background-color":"#f8f8f8", "border-color":"#b2b2b2"};
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
