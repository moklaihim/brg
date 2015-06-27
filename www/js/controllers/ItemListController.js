angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicScrollDelegate", "$ionicListDelegate", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$ionicHistory", "$cordovaBarcodeScanner", "$ZBar", "$ionicPlatform","Items", "Sales", "Codes", function($scope, $ionicScrollDelegate, $ionicListDelegate, $ionicGesture, $state, $filter, $ionicPopup, $ionicHistory, $cordovaBarcodeScanner, $ZBar, $ionicPlatform, Items, Sales, Codes) {
// Start of Item List to show only item list and Brand input
//
    $scope.current.view = 'items_list';
    $scope.headerLabel = "Shoes List ";  // header will reflect ITEM List
    $scope.showInputSelections = true;
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
    $scope.toggleBrand = true;
    $scope.toggelSelected = false;
    $scope.showItemCodeInputs = true;
    
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';
    var editItemClicked = false;
    // var addItemClicked = false;
    var lastItemCodeEntered = false;

    /* Make Brand palate from here*/
    $scope.brands_array = new Array();
    var iil = 3;
    var brands = Codes.get_brands_as_array();

    for (var l = 0; l < Math.ceil(brands.length / iil); l++){
        $scope.brands_array[l] = new Array();
    }

    for (var i = 0; i < brands.length; i++) {
        j = Math.floor(i / iil);
        k = i % iil;
        $scope.brands_array[j][k] = brands[i];
    }

    /* Make Color palate from here*/
    //$scope.colors_array = new Array();
    //var iil = 5; //number of items in line
    $scope.colors_array = Codes.get_colors_as_array();

    /**
    for (var l = 0; l < Math.ceil(colors.length / iil); l++){
        $scope.colors_array[l] = new Array();
    }

    for (var i = 0; i < colors.length; i++) {
        j = Math.floor(i / iil);
        k = i % iil;
        $scope.colors_array[j][k] = colors[i];
    }
    **/
    /* Make Size palate to here*/
    $scope.sizes_array = new Array();
    var iil = 5;
    var sizes = Codes.get_sizes_as_array();

    for (var l = 0; l < Math.ceil(sizes.length / iil); l++){
        $scope.sizes_array[l] = new Array();
    }

    for (var i = 0; i < sizes.length; i++) {
        j = Math.floor(i / iil);
        k = i % iil;
        $scope.sizes_array[j][k] = sizes[i];
    }

    updateItems();
    // updateInstruction();

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
                            //$state.go('main.sales_list');
                            $ionicHistory.goBack();
                        };
                    },
                    function(error) {
                        //$state.go('main.sales_list');
                        $ionicHistory.goBack();
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
        console.log("selectItem function called" + $item_id);
        $scope.current.item_id = $item_id;
        $state.go('main.sales_add');
    };
    $scope.selectItem = selectItem;

    //Show or hide when tap on the item name
    // var searchItem = angular.element(document.querySelector('#searchItem'));
    // $ionicGesture.on('tap', function(e) {
    //     $scope.hideSearchButtons = !$scope.hideSearchButtons;
    //     $scope.$digest();
    // }, searchItem);

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
        // addItemClicked = true;
        $scope.headerLabel = "Shoes List (Adding) "
        // $scope.showInputSelections = true;
        if (lastItemCodeEntered){
            $scope.showPriceInput = true;
            $scope.showSelectedItem = true;
            $scope.headerCloseButton = true; 
            // $scope.showColorInput = false;
            // $scope.headerCloseButton = true;
            $scope.showConfirmBtns = true;
            $scope.showInputSelections = false;
            $scope.showItemList = false;
            $scope.showItemCodeInputs = false;
            lastItemCodeEntered = false;
        }else{
            showItemAddError();
        }
        
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
        $scope.headerLabel = "Shoes List (Editing) "
        $scope.headerCloseButton = true; 
        $scope.showInputSelections = false;
        $scope.showSelectedItem = true;
        $scope.showItemList = false;
        $scope.showPriceInput = true;
        $scope.showSizeInput = false;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showConfirmBtns = true;
        $scope.showEditItemBtn = true;
        $scope.showCancelBtn = true;
        $scope.showAddItemBtn = false;
        $scope.showAddSaleBtn = false;
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
        $scope.showInputSelections = true;
        $scope.showSelectedItem = false;
        $scope.showPriceInput = false;
        $scope.showBrandInput = true;
        $scope.showConfirmBtns = false;
        $scope.showEditItemBtn = false;
        $scope.headerLabel = "Searching "
        // updateInstruction();
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

    function trig_brand(event){
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.showBrandInput = !$scope.showBrandInput;
        $scope.showItemList = true;
        $scope.toggleBrand = !$scope.toggleBrand;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = false;
        // $scopr.showItemList
    }
    $scope.trig_brand = trig_brand;

    function trig_code(event){
        $scope.showCodeInput = !$scope.showCodeInput;
        $scope.showItemList = true;
        $scope.showBrandInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.toggleCode = !$scope.toggleCode;
        $scope.toggleBrand = false;
        $scope.toggleColor = false;
        $scope.toggleSize = false;
        
    }
    $scope.trig_code = trig_code;

    function trig_color(event){

        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = !$scope.showColorInput;
        $scope.showItemList = !$scope.showColorInput;
        $scope.showSizeInput = false;
        $scope.toggleColor = !$scope.toggleColor;
        $scope.toggleCode = false;
        $scope.toggleBrand = false;
        $scope.toggleSize = false;

    }
    $scope.trig_color = trig_color;

    function trig_size(event){
        $scope.showItemList = true;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = !$scope.showSizeInput;
        $scope.toggleSize = !$scope.toggleSize;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleBrand = false;

    }
    $scope.trig_size = trig_size;



    //---------------Custom Keyboard------------------------ 
    $scope.btn_brand= function(brand_id){
        $scope.item_brand = brand_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = true;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.showBackButton = true;
        if($scope.item_code != "Item Code"){
            $scope.item_code = "";
        }
        $scope.toggleBrand = false;
        $scope.toggleCode = true;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            lastItemCodeEntered = true;
            console.log("last item entered")
        }
        itemId();
        // updateInstruction();
        

    };

    $scope.btn_code= function(event){
        if($scope.item_code == "Item Code"){
            $scope.item_code = "";
        }
        $scope.item_code = $scope.item_code + event.target.id;
        if($scope.current.item_id.charAt( 0 ) == 'S'){
            if($scope.item_code.charAt(1)){
                if(!$scope.item_code.charAt(2)){
                    $scope.item_code = $scope.item_code + "-";
                }
            }
        }
        itemId();
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("last item entered")
            lastItemCodeEntered = true;
        }
    };

    $scope.btn_code_ok = function(){

        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = true;
        $scope.showSizeInput = false;
        $scope.toggleColor = true;
        $scope.toggleCode = false;
        $scope.showItemList = false;

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
        $scope.showItemList = true;        
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showColorFilter = false;
        $scope.showSizeInput = true;
        $scope.toggleColor = false;
        $scope.toggleSize = true;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("last item entered")
            lastItemCodeEntered = true;
        }
        itemId();
    };

    $scope.btn_size= function(size_id){
        $scope.item_size = size_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        // if(addItemClicked){ //If add item is clicked
        //     $scope.showPriceInput = true;
        //     $scope.headerCloseButton = true;
        //     $scope.showInputSelections = false;
        //     $scope.showConfirmBtns = true;
        //     $scope.showItemList = false;
        // }
        $scope.toggleSize = false;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("last item entered")
            lastItemCodeEntered = true;
        }

        itemId();
        // $scope.headerLabel = "ITEM : " + $scope.current.item_id;
    };

    $scope.btn_price = function(event){
        if(editItemClicked){
            priceClear();
            editItemClicked = false;
        }
        $scope.retail_price = $scope.retail_price + event.target.id;
    };

    $scope.filterColor = function(event){
        $ionicScrollDelegate.scrollTop();
        $scope.filterLetters = event.target.id;
    }

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
                // updateInstruction();
            }

            if($scope.showColorInput){
                $scope.showBrandInput = false;
                $scope.showCodeInput = true;
                $scope.showColorInput = false;
                $scope.showSizeInput = false;
                $scope.item_code = "";
                itemId();
                // updateInstruction();
            }

            if ($scope.showSizeInput){
                $scope.showBrandInput = false;
                $scope.showCodeInput = false;
                $scope.showColorInput = true;
                $scope.showSizeInput = false;
                $scope.item_color = "";
                itemId();
                // updateInstruction();
            }  

            if (lastItemCodeEntered) {
                $scope.showBrandInput = false;
                $scope.showCodeInput = false;
                $scope.showColorInput = false;
                $scope.showSizeInput = true;
                $scope.item_size = "";
                itemId();
                lastItemCodeEntered =false;
                // updateInstruction();

            }
        }

        if (event.target.id == "PriceBackSpace"){
            // $scope.retail_price = $scope.retail_price.length -1
            $scope.retail_price = $scope.retail_price.substring(0, $scope.retail_price.length - 1);
        }    
    };

    //When the X button beside the ITEM name is clicked
    $scope.itemIdClear= function(){
        //display main item search
        $scope.showItemCodeInputs = true;
        $scope.showInputSelections = true;
        $scope.showItemList = true;
        $scope.headerCloseButton = true;
        $scope.showBrandInput = true;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;

        //hide all others and reset
        $scope.showSelectedItem = false;
        $scope.showPriceInput = false;
        $scope.showCancelBtn = false;
        $scope.showConfirmBtns = false;
        $scope.showEditItemBtn = false;
        $scope.showCancelBtn = false;
        $scope.showAddItemBtn = false;
        $scope.showAddSaleBtn = false;
        $scope.toggleBrand = true;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = false;

        $scope.item_brand = '';
        $scope.item_code ='';
        $scope.item_color ='';
        $scope.item_size = '';
        // addItemClicked = false;
        lastItemCodeEntered = false;
        editItemClicked = false;  //When true , Price input will reset the field value
        priceClear();
        itemId();
        $scope.current.item_id = '';

        // $state.go($state.current, {}, {reload: true})

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
            // updateInstruction();
        }else{
        $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + '-' + $scope.item_size;
        // updateInstruction();
        }

        console.log("the item code is " + $scope.current.item_id)
        if($scope.item_brand){
            $scope.brandHaveValue = true;
        }
        else{
            $scope.brandHaveValue = false;
        }

        if($scope.item_code){
            $scope.codeHaveValue = true;
        }
        else{
            $scope.codeHaveValue = false;
        }

        if($scope.item_color){
            $scope.colorHaveValue = true;
        }
        else{
            $scope.colorHaveValue = false;
        }

        if($scope.item_size){
            $scope.sizeHaveValue = true;
        }
        else{
            $scope.sizeHaveValue = false;
        }
    };
    $scope.itemId = itemId;

    
    // ------------------------------Alert Function----------------------------
    function showAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: 'You are not entering sales for today\'s date',
            okType: 'button-flat'
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
         template: $scope.current.item_id,
         okType: 'button-flat'
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
         template: 'Please complete all fields',
         okType: 'button-flat'
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
    };
    $scope.showItemAddError = showItemAddError;

}])
