angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicScrollDelegate", "$ionicListDelegate", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$cordovaBarcodeScanner", "$ZBar", "$ionicPlatform","Items", "Sales", "Codes", function($scope, $ionicScrollDelegate, $ionicListDelegate, $ionicGesture, $state, $filter, $ionicPopup, $cordovaBarcodeScanner, $ZBar, $ionicPlatform, Items, Sales, Codes) {
// Start of Item List to show only item list and Brand input
//
    $scope.current.view = 'items_list';
    $scope.headerLabel = "ITEM SEARCH : ";  // header will reflect ITEM List
    $scope.showInstruction = true;
    $scope.headerCloseButton = false; 
    $scope.current.item_id ='';
    // $scope.showInputButtons = true;
    $scope.showItemList = true;
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;
    $scope.showConfirmBtns = false;
    $scope.showAddItemBtn = false;
    $scope.showEditItemBtn = false;
    $scope.showAddSaleBtn = false;
    $scope.showBackButton = false;
    $scope.retail_price = '';
    
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';
    var editItemClicked = false;
    var addItemClicked = false;
    var lastItemCodeEntered = false;

    $scope.brands_array = Codes.get_brands_as_array();
    $scope.colors_array = Codes.get_colors_as_array();
    $scope.sizes_array = Codes.get_sizes_as_array();

    updateItems();
    updateInstruction();


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

    //When pulled item list go to scanadd
    $scope.doRefresh = function() {
        $state.go("main.sales_scanadd");
        $scope.$broadcast('scroll.refreshComplete');
    };

    function updateInstruction(){
        if ($scope.showBrandInput == true){
            $scope.headerLabel = "Choose Brand Code";
        }else if($scope.showCodeInput == true){
            $scope.headerLabel = "Enter Item Code";
        }else if($scope.showSizeInput == true){
            $scope.headerLabel = "Choose Size";
        }else if($scope.showColorInput == true){
            $scope.headerLabel = "Choose Color";
        }
    }
    $scope.updateInstruction = updateInstruction;


    //update Items from Firebase
    function updateItems(){
        $scope.items = Items.get();
        $scope.items_array = Items.get_as_array();
    }
    $scope.$on(updateItems);

    //When selected individually from the item list, go to sales add
    function selectItem($item_id){
        console.log("sselectItem function called" + $item_id);
        $scope.current.item_id = $item_id;
        $state.go('main.sales_add');
    };
    $scope.selectItem = selectItem;

    //Show or hide when tap on the item name
    var searchItem = angular.element(document.querySelector('#searchItem'));
    $ionicGesture.on('tap', function(e) {
        $scope.hideSearchButtons = !$scope.hideSearchButtons;
        $scope.$digest();
    }, searchItem);

    //After completing adding new item form, add to sales button is clicked
    $scope.addSaleOK = function(){
        if (!$scope.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered
            return;
        };

        Items.add($scope.current.item_id, $scope.retail_price);
        $state.go('main.sales_add');
        priceClear();

    };
    //when search cannot find item and "Not Found? Add New Item." is clicked" 
    function addItem(event){
        addItemClicked = true;
        // $scope.headerLabel = "ADD ITEM : ";
        $scope.showItemList = false;
        if (lastItemCodeEntered){
            $scope.showPriceInput = true;
            $scope.headerCloseButton = true;
        }
        $scope.showConfirmBtns = true;
        $scope.showAddSaleBtn = true;
        $scope.showAddItemBtn = true;
    }
    $scope.addItem = addItem;

    //After completing adding new item form, add to items only and display messgae item is added
    $scope.addItemOK = function(){
        if (!$scope.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered
            return;
        };

        Items.add($scope.current.item_id, $scope.retail_price);
        showItemAddAlert();
        $scope.current.item_id = '';
        $state.go('main.sales_list');
        priceClear();

    };
    //when individual item is slide and pressed edit
    $scope.editItem = function($item_id) {
        $scope.current.item_id = $item_id;
        $scope.retail_price = $scope.items[$item_id].retail_price;
        $scope.headerLabel = "EDIT ITEM : " + $scope.current.item_id;
        $scope.headerCloseButton = false; //disable clear item name when edit
        $scope.showInstruction = false;
        $scope.showItemList = false;
        $scope.showPriceInput = true;
        $scope.showSizeInput = false;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showBColorInput = false;
        $scope.showInputButtons = false;
        $scope.showConfirmBtns = true;
        $scope.showEditItemBtn = true;
        editItemClicked = true; //When true , Price input will reset the field value
    }
    //When finish editing form and pressed "Update Item" button
    $scope.editItemOK = function(){
        if (!$scope.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered 
            return;
        };
        console.log("edit Ok Pressed");
        $scope.showItemList = true;
        Items.add($scope.current.item_id, $scope.retail_price); 
        $scope.retail_price = '';
        $scope.current.item_id = '';
        $scope.showInstruction = true;
        $scope.showPriceInput = false;
        $scope.showBrandInput = true;
        $scope.showConfirmBtns = false;
        $scope.showEditItemBtn = false;
        updateInstruction();
        $ionicListDelegate.closeOptionButtons();
     
        
        // $state.go('main.items_list');
    };
    //when individual item is slide and pressed delete
    $scope.removeItem = function($item_id) {
        console.log("remove Item item_id: " + $item_id);
        Items.remove($item_id);
        $scope.items_array = Items.get_as_array();
    }
    //make sure items entered are upper case
    $scope.$watch('current.item_id', function(val) {
        $scope.current.item_id = $filter('uppercase')(val);
    }, true);

    //---------------Custom Keyboard------------------------ 
    $scope.btn_brand= function(brand_id){
        $scope.item_brand = brand_id;
        
        $scope.showBrandInput = false;
        $scope.showCodeInput = true;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.showBackButton = true;
        lastItemCodeEntered = false;
        itemId();
        // brandS = 'S';
    };

    $scope.btn_code= function(event){
        $scope.item_code = $scope.item_code + event.target.id;
        if($scope.current.item_id.charAt( 0 ) == 'S'){
            if($scope.item_code.charAt(1)){
                if(!$scope.item_code.charAt(2)){
                    $scope.item_code = $scope.item_code + "-";
                }
            }
        }
        itemId();
        lastItemCodeEntered = false;
    };

    $scope.btn_code_ok = function(){

        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = true;
        $scope.showSizeInput = false;

        itemId();
    }

    $scope.btn_code_clear = function(){
        $scope.item_code = '';
        itemId();
    }

    $scope.btn_code_backspace = function(){
        $scope.item_code = $scope.item_code.substring(0, $scope.item_code.length - 1);
        itemId();
    }

    $scope.btn_color= function(color_id){
        $scope.item_color = color_id;        
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = true;
        lastItemCodeEntered = false;
        itemId();
    };

    $scope.btn_size= function(size_id){
        $scope.item_size = size_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        if(addItemClicked){
            $scope.showPriceInput = true;
            $scope.headerCloseButton = true;
        }
        lastItemCodeEntered = true;

        // $scope.showInstruction = false;
        itemId();
        $scope.headerLabel = "ITEM : " + $scope.current.item_id;
    };

    $scope.btn_price= function(event){
        if(editItemClicked){
            priceClear();
            editItemClicked = false;
        }
        $scope.retail_price = $scope.retail_price + event.target.id;
        // $scope.current.editItemPrice = $scope.new_item.retail_price;
    };
    //Control what type of input is next
    $scope.btn_back= function(event){
        if(event.target.id == "inputBackBtn"){
            if ($scope.showCodeInput){
                $scope.showBackButton = false;
                $scope.showBrandInput = true;
                $scope.showCodeInput = false;
                $scope.showColorInput = false;
                $scope.showSizeInput = false;
                $scope.item_code = "";
                $scope.item_brand = "";
                itemId();
                updateInstruction();
            }

            if($scope.showColorInput){
                $scope.showBrandInput = false;
                $scope.showCodeInput = true;
                $scope.showColorInput = false;
                $scope.showSizeInput = false;
                $scope.item_code = "";
                itemId();
                updateInstruction();
            }

            if ($scope.showSizeInput){
                $scope.showBrandInput = false;
                $scope.showCodeInput = false;
                $scope.showColorInput = true;
                $scope.showSizeInput = false;
                $scope.item_color = "";
                itemId();
                updateInstruction();
            }  

            if (lastItemCodeEntered) {
                $scope.showBrandInput = false;
                $scope.showCodeInput = false;
                $scope.showColorInput = false;
                $scope.showSizeInput = true;
                $scope.item_size = "";
                itemId();
                lastItemCodeEntered =false;
                updateInstruction();

            }
        }

        // if (event.target.id == "codeBack"){
        //     $scope.showBrandInput = true;
        //     $scope.showCodeInput = false;
        //     $scope.showColorInput = false;
        //     $scope.showSizeInput = false;
        //     updateInstruction();
        // }
        // if (event.target.id == "colorBack"){
        //     $scope.showBrandInput = false;
        //     $scope.showCodeInput = true;
        //     $scope.showColorInput = false;
        //     $scope.showSizeInput = false;
        //     updateInstruction();
        // }
        // if (event.target.id == "sizeBack"){
        //     $scope.showBrandInput = false;
        //     $scope.showCodeInput = false;
        //     $scope.showColorInput = true;
        //     $scope.showSizeInput = false;
        //     updateInstruction();
        // }   
        if (event.target.id == "PriceBackSpace"){
            // $scope.retail_price = $scope.retail_price.length -1
            $scope.retail_price = $scope.retail_price.substring(0, $scope.retail_price.length - 1);
        }    
    };

    //When the X button beside the ITEM name is clicked
    $scope.itemIdClear= function(){
        $scope.showInstruction = true;
        $scope.headerCloseButton = false;

        $scope.showBrandInput = true;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.showPriceInput = false;
        $scope.showBackButton = false;
        $scope.item_brand = '';
        $scope.item_code ='';
        $scope.item_color ='';
        $scope.item_size = '';
        $scope.current.item_id = '';
        updateInstruction();
        // itemId();
    };

    //When the X button beside the Retail Price is clicked
    function priceClear(){
        $scope.retail_price = '';
    };
    $scope.priceClear = priceClear;
    //Build item_id when individual input is keyed in
    function itemId(){
        $ionicScrollDelegate.scrollTop();
        if($scope.item_brand == 'S'){
            $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + $scope.item_size;
            updateInstruction();
        }else{
        $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + '-' + $scope.item_size;
        updateInstruction();
        }
    };
    $scope.itemId = itemId;

    
    // ------------------------------Alert Function----------------------------
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
         template: 'Please complete ITEM NAME and RETAIL PRICE'
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
    };
    $scope.showItemAddError = showItemAddError;

}])
