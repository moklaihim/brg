angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicScrollDelegate", "$ionicListDelegate", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$ionicHistory", "$cordovaBarcodeScanner", "$ZBar", "$ionicPlatform","Items", "Sales", "Codes", function($scope, $ionicScrollDelegate, $ionicListDelegate, $ionicGesture, $state, $filter, $ionicPopup, $ionicHistory, $cordovaBarcodeScanner, $ZBar, $ionicPlatform, Items, Sales, Codes) {

// Start of Item List to show only item list and Brand input
//
    $scope.current.view = 'items_list';
    $scope.headerLabel = "Items";  // header will reflect ITEM List
    $scope.showInputSelections = true;
    $scope.current.item_id ='';
    $scope.showItemList = true;
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;
    $scope.toggleBrand = true;
    $scope.toggelSelected = false;
    $scope.showItemCodeInputs = true;
    
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';
    var editItemClicked = false;
    // var addItemClicked = false;
    $scope.allItemCodeEntered = false;

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
    $scope.colors_array = Codes.get_colors_as_array();

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

    if($state.current.name === "main.sales_scanadd"){
        scanFunction();
    };

    if($scope.current.today_date != $scope.current.set_date) {
        showAlert();
    }

    function scanFunction() {
        $ionicPlatform.ready(function(){
            $ZBar
            //$cordovaBarcodeScanner
                .scan(
                    {
                        text_title: "OPTIONAL",
                        flash: "on"
                    },
                    function(barcodeData) {
                        //showAlert(barcodeData.text);
                        //console.log(barcodeData);
                        if(barcodeData){
                            confirmScanResult(barcodeData);
                        }
                        if (barcodeData.cancelled){
                            //$state.go('main.sales_list');
                            $ionicHistory.goBack();
                        };
                    },
                    function(error) {
                        //$state.go('main.sales_list');
                        $ionicHistory.goBack();
                    }
                );
        }); 
    };
    $scope.scanFunction = scanFunction;

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

    function addItem(event){
    // addItemClicked = true;
        $scope.headerLabel = "Shoes List (Adding) "
        // $scope.showInputSelections = true;
        if ($scope.allItemCodeEntered){
            $state.go('main.items_add');  
        }
        else{
            showItemAddError();
        }
    }
    $scope.addItem = addItem;

    //when individual item is slide and pressed edit
    $scope.editItem = function($item_id) {
        $scope.current.item_id = $item_id;
        $scope.current.retail_price = $scope.items[$item_id].retail_price;
        $scope.current.itemAddMode = 'fromedit';
        $state.go('main.items_add');
        $ionicListDelegate.closeOptionButtons();
         //When true , Price input will reset the field value
    }

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
        $scope.showItemList = true;

        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;

        $scope.toggleBrand = true;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = false;

        if($scope.showBrandInput){
            $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        }else{
            $scope.showBrandInput = true;
            if(!$scope.showItemCodeInputs){
                $scope.showItemCodeInputs = true;
            }
        }
    }
    $scope.trig_brand = trig_brand;

    function trig_code(event){
        $scope.showItemList = true;

        $scope.showBrandInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = true;
        $scope.toggleColor = false;
        $scope.toggleSize = false;

        if($scope.showCodeInput){
            $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        }else{
            $scope.showCodeInput = true;
            if(!$scope.showItemCodeInputs){
                $scope.showItemCodeInputs = true;
            }
        }

        
    }
    $scope.trig_code = trig_code;

    function trig_color(event){
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showSizeInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = false;
        $scope.toggleColor = true;
        $scope.toggleSize = false;

        if($scope.showColorInput){
            $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        }else{
            $scope.showColorInput = true;
            if(!$scope.showItemCodeInputs){
                $scope.showItemCodeInputs = true;
            }
        }
        $scope.showItemList = !$scope.showColorInput;
    }
    $scope.trig_color = trig_color;

    function trig_size(event){
        $scope.showItemList = true;

        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = true;

        if($scope.showSizeInput){
            $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        }else{
            $scope.showSizeInput = true;
            if(!$scope.showItemCodeInputs){
                $scope.showItemCodeInputs = true;
            }
        }
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
            $scope.allItemCodeEntered = true;
            console.log("$scopeall item entered");
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
            console.log("$scopeall item entered");
            $scope.allItemCodeEntered = true;
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
            console.log("$scopeall item entered");
            $scope.allItemCodeEntered = true;
        }
        itemId();
    };

    $scope.btn_size= function(size_id){
        $scope.item_size = size_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.toggleSize = false;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("$scopeall item entered");
            $scope.allItemCodeEntered = true;
        }

        itemId();
        // $scope.headerLabel = "ITEM : " + $scope.current.item_id;
    };

    $scope.filterColor = function(event){
        $ionicScrollDelegate.scrollTop();
        $scope.filterLetters = event.target.id;
    };

    //When the X button beside the Retail Price is clicked
    function itemId(){
        $ionicScrollDelegate.scrollTop();
        if($scope.item_brand == 'S'){
            $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + $scope.item_size;
            // updateInstruction();
        }else{
        $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + '-' + $scope.item_size;
        // updateInstruction();
        }

        console.log("the item code is " + $scope.current.item_id);
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

    function confirmScanResult(barcodeData){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Verify Scanned Code',
         template: 'Scanned : ' +  '<h2>'+ barcodeData + '</h2>',
         okType: 'button-flat',
         cancelType: 'button-flat'
       });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
                if (!$scope.items.hasOwnProperty(barcodeData)){
                    $scope.current.item_id = barcodeData;
                    $state.go('main.items_add');
                };
                if ($scope.items.hasOwnProperty(barcodeData)){
                    $scope.current.item_id = barcodeData;
                    $state.go('main.sales_add');
                };
            } if(!res) {
                console.log('You are not sure');
                scanFunction();
            }
        });
    };
    $scope.confirmScanResult = confirmScanResult;

}])
