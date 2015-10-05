angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$timeout", "$ionicGesture", "$ionicScrollDelegate", "$state", "$filter", "$ionicHistory", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", "Codes", function($scope, $timeout, $ionicGesture, $ionicScrollDelegate, $state, $filter, $ionicHistory, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales, Codes) {
    $scope.showPriceInput = false;
    $scope.GiftToggle = false;
    $scope.PromoToggle = false;
    
    $scope.iframeHeight = window.innerHeight;
    $scope.checkStore();
    console.log("height = " + $scope.iframeHeight);

    $scope.sale = {
        // sale_key: '',
        item_id: '',
        retail_price: '',
        sale_price: '',
        promo_choice:'',
        promo_desc:'',
        gift:'',
        qty: '',
        discount_rate:'',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.promos = Codes.get_promos();


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
        $scope.headerLabel = "EDITING SALES : ";
        p_sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        p_sales.then(function(sales_detail){
            $scope.sales = sales_detail;
            $scope.sale.item_id = $scope.sales[$scope.current.item_key].item;
            $scope.sale.sale_price = $scope.sales[$scope.current.item_key].price;
            $scope.sale.promo_choice = $scope.sales[$scope.current.item_key].promo_choice;
            $scope.sale.gift = $scope.sales[$scope.current.item_key].gift;
            $scope.sale.retail_price = $scope.items[$scope.sale.item_id].retail_price;
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
            if($scope.sale.promo_choice != ''){
                $scope.PromoToggle = true;
            }
            if($scope.sale.gift != ''){
                $scope.GiftToggle = true;
            }

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

        if (!$scope.sale.promo_choice && $scope.sale.discount_rate != 0){
            $scope.sale.promo_choice = "Disc";
        }
        if ($scope.current.item_key){
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.sale.discount_rate, $scope.sale.promo_choice, $scope.sale.gift, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.current.item_key, $scope.user_detail.email, $scope.sale.retail_price);
        }else {
            for (var i = 0; i < $scope.sale.qty; i++) {
                console.log("Sale_key FAIL in Sales.js")
                Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.sale.discount_rate, $scope.sale.promo_choice, $scope.sale.gift, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, false, $scope.user_detail.email, $scope.sale.retail_price);
                console.log("entry")
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

            $scope.contentHeight = $scope.iframeHeight;
            $scope.showPriceInput = false;
            $timeout(function() {
                $ionicScrollDelegate.scrollTop();
            },500);
    }

    $scope.hideNumpad = hideNumpad;

    $scope.btn_back=function(){
        if($scope.discountToggle){
            $scope.sale.discount_rate = String($scope.sale.discount_rate).slice(0, -1);
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
            if($scope.sale.discount_rate == ''){
                $scope.sale.discount_rate = 0;
            }
            console.log("promo selected is " + $scope.sale.promo_choice);
        }else if($scope.saleToggle){
            //console.log("sale price back button clicked");
            //$scope.sale.sale_price = 2;
            if(String($scope.sale.sale_price).slice(-1) == '.'){
                $scope.sale.sale_price = String($scope.sale.sale_price).slice(0, -2);
            }else{
                $scope.sale.sale_price = String($scope.sale.sale_price).slice(0, -1);
            }
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
        }else if($scope.qtyToggle){
            $scope.sale.qty = String($scope.sale.qty).slice(0, -1);
        }
    }



    function promoToggle(){
        $scope.PromoToggle = !$scope.PromoToggle;
        // $scope.sale.sale_price = $scope.items[$scope.current.item_id].retail_price;
        if ($scope.PromoToggle == false){
            $scope.sale.discount_rate = 0;
            $scope.sale.promo_desc = "";
            $scope.sale.promo_choice = "";
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
            console.log("promo is " + $scope.sale.promo_choice);
        }
    }
    $scope.promoToggle = promoToggle;

    function promoChoice(promo_id){
        $scope.sale.promo_choice = promo_id;
        $scope.sale.promo_desc = $scope.promos[$scope.sale.promo_choice].desc;
        if($scope.promos[$scope.sale.promo_choice].promo_sale_price){
            $scope.sale.sale_price = $scope.promos[$scope.sale.promo_choice].promo_sale_price;
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
        }
        if($scope.promos[$scope.sale.promo_choice].promo_discount){
            $scope.sale.discount_rate = $scope.promos[$scope.sale.promo_choice].promo_discount;
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
        }
        
        console.log("promo is " + $scope.promos[$scope.sale.promo_choice]);

    }
    $scope.promoChoice = promoChoice;

    function giftToggle(){
        $scope.GiftToggle = !$scope.GiftToggle;
        if ($scope.GiftToggle == true) {
            $scope.sale.gift = 'FG';
        }
        else{
            $scope.sale.gift = '';
        }

    }
    $scope.giftToggle = giftToggle;

    $scope.priceToggle= function(event){
        $scope.contentHeight = $scope.iframeHeight - 220;
        $timeout(function() {
            $ionicScrollDelegate.scrollTo(0,160,true);
        },500);

        $scope.showPriceInput = true;
        if(event.target.id == 'discount_rate'){
            // $scope.showPriceInput = !$scope.showPriceInput;
            if($scope.sale.qty == ''){
                $scope.sale.qty = 1;
            }
            $scope.discountToggle = true;
            $scope.saleToggle = false;
            $scope.qtyToggle = false;
            $scope.showDiscountDel = true;
            $scope.showSaleDel = false;
            $scope.showQtyDel = false;
            // $scope.sale.discount_rate = 0;
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;

        } else if(event.target.id == 'sale'){
            // $scope.showPriceInput = !$scope.showPriceInput;
            if($scope.sale.qty == ''){
                $scope.sale.qty = 1;
            }
            $scope.discountToggle = false;
            $scope.saleToggle = true;
            $scope.qtyToggle = false;
            $scope.showSaleDel = true;
            $scope.showDiscountDel = false;
            $scope.showQtyDel = false;
            // $scope.sale.sale_price = '';
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));

        } else if(event.target.id == 'qty'){
            if($scope.sale.qty == ''){
                $scope.sale.qty = 1;
            }
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

}])
