angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$timeout", "$ionicGesture", "$ionicScrollDelegate", "$state", "$filter", "$ionicPopup", "$ionicHistory", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $timeout, $ionicGesture, $ionicScrollDelegate, $state, $filter, $ionicPopup, $ionicHistory, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {
    $scope.showDisOption = false;
    $scope.showPriceInput = false;
    $scope.iframeHeight = window.innerHeight;



    $scope.sale = {
        // sale_key: '',
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);

    console.log("Loaded Current Item: " + $scope.current.item_id);
    if($scope.current.item_id){
        $scope.showQtyField = true;
        $scope.headerLabel = "ADDING SALES : ";
        $scope.sale.item_id = $scope.current.item_id;
        $scope.sale.retail_price = $scope.items[$scope.current.item_id].retail_price;
        $scope.sale.discount_rate = '0';
        $scope.sale.sale_price = $scope.items[$scope.current.item_id].retail_price;
        $scope.sale.qty = 1;

    }else if ($scope.current.item_key){
        $scope.showQtyField = false;
        $scope.sales.$loaded().then(function(){
            $scope.headerLabel = "EDITING SALES : ";
            $scope.sale.item_id = $scope.sales[$scope.current.item_key].item;
            $scope.sale.sale_price = $scope.sales[$scope.current.item_key].price;
            $scope.sale.retail_price = $scope.items[$scope.sale.item_id].retail_price;
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
            checkHaveValue();
        });
    }else if ($state.current.name === "main.sales_scanadd"){
        $scope.showItemList = false;
    }else{
        $scope.showItemList = true;
    }
    checkHaveValue();

    $scope.cancel = function(){
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        if ($scope.current.item_key){
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.current.item_key);
        }else {
            for (var i = 0; i < $scope.sale.qty; i++) {
                console.log("Sale_key FAIL in Sales.js")
                Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, false);
            }
        }
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        $state.go('main.sales_list');
    };

    $scope.btn_price= function(event){

        if($scope.discountToggle){
            if($scope.sale.discount_rate == 0){
                $scope.sale.discount_rate ='';
            }
            $scope.sale.discount_rate = $scope.sale.discount_rate + event.target.id;
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
            checkHaveValue();
        }
        if($scope.saleToggle){
            $scope.sale.sale_price = $scope.sale.sale_price + event.target.id;
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
            checkHaveValue();
        }
        if($scope.qtyToggle){
            $scope.sale.qty = $scope.sale.qty + event.target.id;
            checkHaveValue();
        }


        // $scope.retail_price = $scope.retail_price + event.target.id;
    };

    function checkHaveValue(){
        if($scope.sale.discount_rate){
            $scope.discountHaveValue = true;
        }else{
            $scope.discountHaveValue = false;
        }

        if($scope.sale.sale_price){
            $scope.saleHaveValue = true;
        }else{
            $scope.saleHaveValue = false;
        }

        if($scope.sale.qty){
            $scope.qtyHaveValue = true;
        }else{
            $scope.qtyHaveValue = false;
        }

    };
    $scope.checkHaveValue = checkHaveValue;

    function hideNumpad(){
            $scope.smallScreenDetected = false;
            $scope.showPriceInput = false;
            $timeout(function() {
                $ionicScrollDelegate.scrollTop();
            },100);
    }

    $scope.hideNumpad = hideNumpad;

    $scope.btn_back=function(){
        if ($scope.discountToggle){
            // $scope.retail_price = $scope.retail_price.length -1
            $scope.sale.discount_rate = $scope.sale.discount_rate.substring(0, $scope.sale.discount_rate.length - 1);
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
        }   if($scope.sale.discount_rate == ''){
                $scope.sale.discount_rate = 0;
            }
        if ($scope.saleToggle){
            // $scope.retail_price = $scope.retail_price.length -1
            $scope.sale.sale_price = $scope.sale.sale_price.substring(0, $scope.sale.sale_price.length - 1);
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
        }
        if ($scope.qtyToggle){
            // $scope.retail_price = $scope.retail_price.length -1
            $scope.sale.qty = $scope.sale.qty.substring(0, $scope.sale.qty.length - 1);
        }

    }


    $scope.priceToggle= function(event){
        if($scope.iframeHeight < 500){
            $scope.smallScreenDetected = true;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom();
            },100);
        }

        $scope.showPriceInput = true;
        if(event.target.id == 'discount'){
            // $scope.showPriceInput = !$scope.showPriceInput;
            $scope.discountToggle = true;
            $scope.saleToggle = false;
            $scope.qtyToggle = false;
            $scope.showDiscountDel = true;
            $scope.showSaleDel = false;
            $scope.showQtyDel = false;
            $scope.sale.discount_rate = 0;
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;

        }

        if(event.target.id == 'sale'){
            // $scope.showPriceInput = !$scope.showPriceInput;
            $scope.discountToggle = false;
            $scope.saleToggle = true;
            $scope.qtyToggle = false;
            $scope.showSaleDel = true;
            $scope.showDiscountDel = false;
            $scope.showQtyDel = false;
            $scope.sale.sale_price = '';
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
        }

        if(event.target.id == 'qty'){
            // $scope.showPriceInput = !$scope.showPriceInput;
            $scope.discountToggle = false;
            $scope.saleToggle = false;
            $scope.qtyToggle = true;
            $scope.showDiscountDel = false;
            $scope.showSaleDel = false;
            $scope.showQtyDel = true;
            $scope.sale.qty = '';
        }



        console.log("button clicked");
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
    // $scope.$digest();

}])
