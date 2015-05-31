angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$cordovaBarcodeScanner", "$ZBar", "$ionicPlatform","Items", "Sales", function($scope, $ionicGesture, $state, $filter, $ionicPopup, $cordovaBarcodeScanner, $ZBar, $ionicPlatform, Items, Sales) {
// Start of Item List to show only item list and Brand input
    $scope.headerLabel = "ITEM LIST : ";  // header will reflect ITEM List
    $scope.headerCloseButton = true;
    $scope.current.item_id ='';
    $scope.showItemList = true;
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;
    $scope.showConfirmBtns = false;
    $scope.showAddItemBtn = false;
    $scope.showEditItemBtn = false;
    $scope.showAddSaleBtn = false;
    $scope.retail_price = '';

    // $scope.new_item = {
    //     retail_price: ''
    // } 

    updateItems();
    
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';
    var editItemClicked = false;
    var addItemClicked = false;
    var lastItemCodeEntered = false;
    $scope.searchInputStyle = {'position':'fixed','bottom':'0%','width':'100%'};
    var brandbtns = ["HB", "F", "R", "H", "S"];
    var colorbtns = ["BLK", "BLU", "GRN", "BRN"];
    var sizebtns = ["38", "39", "40", "41", "42", "43", "44", "45"];
    var allbtns = brandbtns.concat(colorbtns,sizebtns);

    if($state.current.name === "main.sales_scanadd"){
        $ionicPlatform.ready(function(){
            $ZBar
            //$cordovaBarcodeScanner
                .scan()
                .then(
                    function(barcodeData) {
                        //showAlert(barcodeData.text);
                        //console.log(barcodeData);
                        if (!$scope.items.hasOwnProperty(barcodeData)){
                            $scope.current.item_id = barcodeData;
                            // $state.go('main.items_add');
                            lastItemCodeEntered = true;
                            $scope.showBrandInput = false;
                            addItem();
                        };
                        if ($scope.items.hasOwnProperty(barcodeData)){
                            selectItem(barcodeData);
                        };
                        if (barcodeData.cancelled){
                            $state.go('main.sales_list');
                        };
                    },
                    function(error) {
                        $state.go('main.sales_list');
                    },
                    {
                        text_title: "OPTIONAL",
                        flash: "on"
                    }
                );
        }); 
    };

    if($scope.current.today_date != $scope.current.set_date) {
        showAlert();
    }

    function selectItem($item_id){
        console.log("sselectItem function called" + $item_id);
        $scope.current.item_id = $item_id;
        $state.go('main.sales_add');
    };
    $scope.selectItem = selectItem;

    function addItem(event){
        addItemClicked = true;
        $scope.headerLabel = "ADD ITEM : ";
        $scope.showItemList = false;
        if (lastItemCodeEntered){
            $scope.showPriceInput = true;
        }
        $scope.searchInputStyle = {'position':'fixed','top':'100px','width':'100%'};
        $scope.showConfirmBtns = true;
        $scope.showAddSaleBtn = true;
        $scope.showAddItemBtn = true;
    }
    $scope.addItem = addItem;

    $scope.editItem = function($item_id) {
        $scope.current.item_id = $item_id;
        $scope.retail_price = $scope.items[$item_id].retail_price;
        $scope.searchInputStyle = {'position':'fixed','top':'100px','width':'100%'};
        $scope.headerLabel = "EDIT ITEM : ";
        $scope.showItemList = false;
        $scope.showPriceInput = true;
        $scope.showBrandInput = false;
        $scope.showSearchButtons = false;
        $scope.showConfirmBtns = true;
        $scope.showEditItemBtn = true;
        editItemClicked = true; //When true , Price input will reset the field value
    }

    $scope.removeItem = function($item_id) {
        console.log("remove Item item_id: " + $item_id);
        Items.remove($item_id);
        $scope.items_array = Items.get_as_array();
    }

    function updateItems(){
        $scope.items = Items.get();
        $scope.items_array = Items.get_as_array();
    }
    $scope.$on(updateItems);

    $scope.$watch('current.item_id', function(val) {
        $scope.current.item_id = $filter('uppercase')(val);
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
        $scope.showBrandInput = false;
        $scope.showCodeInput = true;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        lastItemCodeEntered = false;
        // brandS = 'S';
    };

    $scope.btn_code= function(event){
        $scope.item_code = $scope.item_code + event.target.id;
        itemId();
        lastItemCodeEntered = false;
    };

    $scope.btn_code_ok = function(){
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = true;
        $scope.showSizeInput = false;

    }

    $scope.btn_code_clear = function(){
        $scope.item_code = '';
        itemId();
    }

    $scope.btn_color= function(event){
        
        // if (brandS == S){

        // }
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
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = true;
        lastItemCodeEntered = false;
    };

    $scope.btn_size= function(event){
        
        // $scope.ClearBg = {};
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
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        if(addItemClicked){
            $scope.showPriceInput = true;
        }
        lastItemCodeEntered = true;
    };

    $scope.btn_price= function(event){
        if(editItemClicked){
            priceClear();
            editItemClicked = false;
        }
        $scope.retail_price = $scope.retail_price + event.target.id;
        // $scope.current.editItemPrice = $scope.new_item.retail_price;
    };

    $scope.btn_back= function(event){

        if (event.target.id == "codeBack"){
            $scope.showBrandInput = true;
            $scope.showCodeInput = false;
            $scope.showColorInput = false;
            $scope.showSizeInput = false;
        }
        if (event.target.id == "colorBack"){
            $scope.showBrandInput = false;
            $scope.showCodeInput = true;
            $scope.showColorInput = false;
            $scope.showSizeInput = false;
        }
        if (event.target.id == "sizeBack"){
            $scope.showBrandInput = false;
            $scope.showCodeInput = false;
            $scope.showColorInput = true;
            $scope.showSizeInput = false;
        }   
        if (event.target.id == "PriceBackSpace"){
            $scope.retail_price = $scope.retail_price.length -1
            // $scope.current.editItemPrice = $scope.new_item.retail_price;
        }    
    };

    $scope.itemIdClear= function(){
        $scope.showBrandInput = true;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.item_brand = '';
        $scope.item_code ='';
        $scope.item_color ='';
        $scope.item_size = '';
        for (btn in allbtns) {
            document.getElementById(allbtns[btn]).className = "button";
        }
        itemId();
    };

    function priceClear(){
        $scope.retail_price = '';
        // $scope.current.editItemPrice = $scope.new_item.retail_price;
    };
    $scope.priceClear = priceClear;

    function itemId(){
        if($scope.item_brand == 'S'){
            $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + $scope.item_size;
        }else{
        $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + '-' + $scope.item_size;
        }
    };
    $scope.itemId = itemId;

    $scope.addItemOK = function(){
        if (!$scope.retail_price){
            showItemAddError();
            return;
        };

        Items.add($scope.current.item_id, $scope.retail_price);
        showItemAddAlert();
        $scope.current.item_id = '';
        $state.go('main.sales_list');
        priceClear();

    };

    $scope.editItemOK = function(){
        if (!$scope.retail_price){
            showItemAddError();
            return;
        };
        Items.add($scope.current.item_id, $scope.retail_price);
        // $scope.current.editItemKey = '';
        $scope.retail_price = '';
        $scope.current.item_id = '';
        // $state.go('main.items_list');
        $state.go($state.current, {}, {reload: true});
    
    };

    $scope.addSaleOK = function(){
        if (!$scope.retail_price){
            showItemAddError();
            return;
        };

        Items.add($scope.current.item_id, $scope.retail_price);
        $state.go('main.sales_add');
        priceClear();

    };


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
         title: 'Scan!',
         template: barcodeData.text
        });
        alertPopup.then(function(res) {
         console.log('Thank you for different date');
        });
    };
    $scope.showAlert = showAlert;

    function showItemAddAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'ADDED ITEM',
         template: $scope.current.item_id
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
    };
    $scope.showItemAddAlert = showItemAddAlert;

    function showItemAddError(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'INCOMPLETE ENTRY',
         template: 'Please complete the process'
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
    };
    $scope.showItemAddError = showItemAddError;

}])
