angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$timeout", "$ionicGesture", "$ionicScrollDelegate", "$state", "$filter", "$ionicHistory", "$ionicPlatform","Items", "Sales", "Codes", "Env", "Logging", function($scope, $timeout, $ionicGesture, $ionicScrollDelegate, $state, $filter, $ionicHistory, $ionicPlatform, Items, Sales, Codes, Env, Logging) {
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('SaleAddController');
    //}
    Logging.log2FB($scope.user_detail.email, "SaleAddController started");
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
        var fb_item_id = $scope.current.item_id.replace(/\./g, '_2E');
        Logging.log2FB($scope.user_detail.email, "Add Sale Button Pressed");
        $scope.showQtyField = true;
        $scope.headerLabel = "ADDING SALES : ";
        $scope.sale.item_id = $scope.current.item_id;
        $scope.sale.retail_price = $scope.items[fb_item_id].retail_price;
        $scope.sale.discount_rate = '0';
        $scope.sale.sale_price = $scope.items[fb_item_id].retail_price;
        $scope.sale.qty = 1;

    }else if ($scope.current.item_key){
        Logging.log2FB($scope.user_detail.email, "Edit Sale Button Pressed");
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
        Logging.log2FB($scope.user_detail.email, "Scan View Initiated");
        $scope.showItemList = false;
    }else{
        $scope.showItemList = true;
    }
    checkHaveValue();

    $scope.cancel = function(){
        Logging.log2FB($scope.user_detail.email, "starts cancel function in SaleAddController");
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        Logging.log2FB($scope.user_detail.email, "ends cancel function in SaleAddController");
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        Logging.log2FB($scope.user_detail.email, "starts ok function in SaleAddController");

        if (!$scope.sale.promo_choice && $scope.sale.discount_rate != 0){
            $scope.sale.promo_choice = "Disc";
        }
        if ($scope.current.item_key){
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.sale.discount_rate, $scope.sale.promo_choice, $scope.sale.gift, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.current.item_key, $scope.user_detail.email, $scope.sale.retail_price);
        }else {
            for (var i = 0; i < $scope.sale.qty; i++) {
                console.log("Sale_key FAIL in Sales.js")
                Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.sale.discount_rate, $scope.sale.promo_choice, $scope.sale.gift, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, false, $scope.user_detail.email, $scope.sale.retail_price);
                    if($scope.current.today_date != $scope.current.set_date) {
                        console.log("previous date entered sales " + $scope.sale.item_id + " On " + $scope.current.set_date)
                    }
                console.log("entry")
            }
        }
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        Logging.log2FB($scope.user_detail.email, "ends ok function in SaleAddController");
        $state.go('main.sales_list');
    };

    $scope.btn_price= function(event){
        Logging.log2FB($scope.user_detail.email, "starts btn_price function in SaleAddController");
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
        Logging.log2FB($scope.user_detail.email, "ends btn_price function in SaleAddController");

        // $scope.retail_price = $scope.retail_price + event.target.id;
    };

    function checkHaveValue(){
        // Logging.log2FB($scope.user_detail.email, "starts checkHaveValue function in SaleAddController");
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
        // Logging.log2FB($scope.user_detail.email, "ends checkHaveValue function in SaleAddController");
    };
    $scope.checkHaveValue = checkHaveValue;

    function hideNumpad(){
        Logging.log2FB($scope.user_detail.email, "starts hideNumpad function in SaleAddController");

            $scope.contentHeight = $scope.iframeHeight;
            $scope.showPriceInput = false;
            $timeout(function() {
                $ionicScrollDelegate.scrollTop();
            },500);
        Logging.log2FB($scope.user_detail.email, "ends hideNumpad function in SaleAddController");    
    }
    $scope.hideNumpad = hideNumpad;

    $scope.btn_back=function(){
        Logging.log2FB($scope.user_detail.email, "starts btn_back function in SaleAddController");
        if($scope.discountToggle){
            Logging.log2FB($scope.user_detail.email, "Pressed keypad back on discount field");
            $scope.sale.discount_rate = String($scope.sale.discount_rate).slice(0, -1);
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
            if($scope.sale.discount_rate == ''){
                $scope.sale.discount_rate = 0;
            }
            console.log("promo selected is " + $scope.sale.promo_choice);
        }else if($scope.saleToggle){
            Logging.log2FB($scope.user_detail.email, "Pressed keypad back on sale price field");
            //console.log("sale price back button clicked");
            //$scope.sale.sale_price = 2;
            if(String($scope.sale.sale_price).slice(-1) == '.'){
                $scope.sale.sale_price = String($scope.sale.sale_price).slice(0, -2);
            }else{
                $scope.sale.sale_price = String($scope.sale.sale_price).slice(0, -1);
            }
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));
        }else if($scope.qtyToggle){
            Logging.log2FB($scope.user_detail.email, "Pressed keypad back on quantity field");
            $scope.sale.qty = String($scope.sale.qty).slice(0, -1);
        }
        Logging.log2FB($scope.user_detail.email, "ends btn_back function in SaleAddController");
    }



    function promoToggle(){
        Logging.log2FB($scope.user_detail.email, "starts promoToggle function in SaleAddController");
        $scope.PromoToggle = !$scope.PromoToggle;
        // $scope.sale.sale_price = $scope.items[$scope.current.item_id].retail_price;
        if ($scope.PromoToggle == false){
            $scope.sale.discount_rate = 0;
            $scope.sale.promo_desc = "";
            $scope.sale.promo_choice = "";
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;
            console.log("promo is " + $scope.sale.promo_choice);
        }
        Logging.log2FB($scope.user_detail.email, "ends promoToggle function in SaleAddController");
    }
    $scope.promoToggle = promoToggle;

    function promoChoice(promo_id){
        Logging.log2FB($scope.user_detail.email, "starts promoChoice function in SaleAddController");
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
        
        // console.log("promo is " + $scope.promos[$scope.sale.promo_choice]);
        Logging.log2FB($scope.user_detail.email, "ends promoChoice function in SaleAddController");

    }
    $scope.promoChoice = promoChoice;

    function giftToggle(){
        Logging.log2FB($scope.user_detail.email, "starts giftToggle function in SaleAddController");
        $scope.GiftToggle = !$scope.GiftToggle;
        if ($scope.GiftToggle == true) {
            $scope.sale.gift = 'FG';
        }
        else{
            $scope.sale.gift = '';
        }
        Logging.log2FB($scope.user_detail.email, "ends giftToggle function in SaleAddController");
    }
    $scope.giftToggle = giftToggle;

    $scope.priceToggle= function(event){
        Logging.log2FB($scope.user_detail.email, "starts priceToggle function in SaleAddController");

        $scope.contentHeight = $scope.iframeHeight - 220;
        $timeout(function() {
            $ionicScrollDelegate.scrollTo(0,160,true);
        },500);
        if($scope.sale.promo_choice != "z"){
            $scope.sale.promo_choice = "";
            $scope.sale.promo_desc = "";
        }
        $scope.showPriceInput = true;
        if(event.target.id == 'discount_rate'){
            Logging.log2FB($scope.user_detail.email, "discount field pressed");
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
            $scope.sale.discount_rate = 0;
            $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * $scope.sale.discount_rate / 100;

        } else if(event.target.id == 'sale'){
            Logging.log2FB($scope.user_detail.email, "sale price field pressed");
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
            $scope.sale.sale_price = '';
            $scope.sale.discount_rate = Math.round(100 -($scope.sale.sale_price / $scope.sale.retail_price * 100));

        } else if(event.target.id == 'qty'){
            Logging.log2FB($scope.user_detail.email, "quantity field pressed");
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
        Logging.log2FB($scope.user_detail.email, "ends priceToggle function in SaleAddController");

        console.log("button clicked");
    };

}])
