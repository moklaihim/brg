angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicScrollDelegate", "$ionicListDelegate", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$ionicHistory", "$ionicPlatform", "Items", "Sales", "Codes", "Env", "Logging", function($scope, $ionicScrollDelegate, $ionicListDelegate, $ionicGesture, $state, $filter, $ionicPopup, $ionicHistory, $ionicPlatform, Items, Sales, Codes, Env, Logging) {
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('ItemListController');
    //}

// Start of Item List to show only item list and Brand input
//  
    Logging.log2FB($scope.user_detail.email, "ItemListController started");
    $scope.current.view = 'items_list';
    $scope.headerLabel = "Items";  // header will reflect ITEM List
    $scope.showInputSelections = true;
    $scope.showItemCodeInputs = true;
    $scope.current.item_id ='';
    $scope.showItemList = true;
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;
    $scope.toggleBrand = true;
    $scope.toggelSelected = false;
    $scope.brandHasValue = false;
    $scope.codeHasValue = false;
    $scope.colorHasValue = false;
    $scope.sizeHasValue = false;
    
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';
    var editItemClicked = false;
    // var addItemClicked = false;
    $scope.allItemCodeEntered = false;
    $scope.checkStore();


    /* Make Brand palate from here*/
    $scope.brands_array = new Array();
    $scope.isUpdated = function(){
      return Items.isUpdated();
    };
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
    var iil = 6;
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

    /*
    function scanFunction() {
        $ionicPlatform.ready(function(){
            $ZBar
            //$cordovaBarcodeScanner
                .scan({
                        text_title: "Scan Barcode",
                        text_instructions: "Align the barcode on the red line",
                        flash: "off"
                    })
                .then(
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
                    }
                );
        }); 
    };
    $scope.scanFunction = scanFunction;
    */

    //update Items from Firebase
    function updateItems(){
        Logging.log2FB($scope.user_detail.email, "starts updateItems function in ItemListController");
        $scope.items = Items.get();
        $scope.items_array = Items.get_as_array();
        Logging.log2FB($scope.user_detail.email, "ends updateItems function in ItemListController");
    }
    $scope.$on(updateItems);

    //When selected individually from the item list, go to sales add
    function selectItem($item_id){
        Logging.log2FB($scope.user_detail.email, "starts selectItem function in ItemListController");
        console.log("selectItem function called" + $item_id);
        $scope.current.item_id = $item_id;
        $state.go('main.sales_add');
        Logging.log2FB($scope.user_detail.email, "ends selectItem function in ItemListController");
    };
    $scope.selectItem = selectItem;

    function addItem(event){
        Logging.log2FB($scope.user_detail.email, "starts addItem function in ItemListController");
    // addItemClicked = true;
        if($scope.item_brand == 'S'){
            $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + $scope.item_size;
        }else{
            $scope.current.item_id = $scope.item_brand + $scope.item_code + '-' + $scope.item_color + '-' + $scope.item_size;
        }

        console.log("the item code is " + $scope.current.item_id);
        $scope.headerLabel = "Shoes List (Adding) "
        // $scope.showInputSelections = true;
        if ($scope.allItemCodeEntered){
            // console.log("the item code is " + $scope.current.item_id);
            $state.go('main.items_add');  
        }
        else{
            showItemAddError();
        }
        Logging.log2FB($scope.user_detail.email, "ends addItem function in ItemListController");
    }
    $scope.addItem = addItem;

    //when individual item is slide and pressed edit
    $scope.editItem = function($item_id) {

        Logging.log2FB($scope.user_detail.email, "starts editItem function in ItemListController");
        if($item_id.indexOf(".") > -1){
                $item_id = $item_id.replace(/\./g, '_2E')
            };
        $scope.current.item_id = $item_id;
        $scope.current.retail_price = $scope.items[$item_id].retail_price;
        $scope.current.itemAddMode = 'fromedit';
        $state.go('main.items_add');
        $ionicListDelegate.closeOptionButtons();
         //When true , Price input will reset the field value
         Logging.log2FB($scope.user_detail.email, "ends editItem function in ItemListController");
    }

    //when individual item is slide and pressed delete
    $scope.removeItem = function($item_id) {
        Logging.log2FB($scope.user_detail.email, "starts removeItem function in ItemListController");
        console.log("remove Item item_id: " + $item_id);
        if($item_id.indexOf(".") > -1){
                $item_id = $item_id.replace(/\./g, '_2E')
            };
        console.log("remove new Item item_id: " + $item_id);
        Items.remove($item_id);
        $scope.items_array = Items.get_as_array();
        Logging.log2FB($scope.user_detail.email, "ends removeItem function in ItemListController");
    }

    $scope.updateDB = function(){
        Items.update();
    }
    
    //make sure items entered are upper case
    $scope.$watch('current.item_id', function(val) {
        $scope.current.item_id = $filter('uppercase')(val);
    }, false);


    $scope.$on('updatedbCompleted', function() {
      updateItems();
      $scope.$broadcast('scroll.refreshComplete');
    });

    /*
    $scope.$watch('Items.updated', function(val){
        console.log("Items.updated updatd");
        updateItems();
    }, false);
    */

    function trig_brand(event){
        Logging.log2FB($scope.user_detail.email, "starts trig_brand function in ItemListController");
        $scope.showItemList = true;
        $scope.showBrandInput = true;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;


        $scope.toggleBrand = true;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = false;

        // if($scope.showBrandInput){
        //     $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        // }else{
        //     $scope.showBrandInput = true;
        //     if(!$scope.showItemCodeInputs){
        //         $scope.showItemCodeInputs = true;
        //     }
        // }
        Logging.log2FB($scope.user_detail.email, "ends trig_brand function in ItemListController");
    }
    $scope.trig_brand = trig_brand;

    function trig_code(event){
        Logging.log2FB($scope.user_detail.email, "starts trig_code function in ItemListController");
        $scope.showItemList = true;
        $scope.showCodeInput = true;
        $scope.showBrandInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = true;
        $scope.toggleColor = false;
        $scope.toggleSize = false;

        // if($scope.showCodeInput){
        //     $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        // }else{
        //     $scope.showCodeInput = true;
        //     if(!$scope.showItemCodeInputs){
        //         $scope.showItemCodeInputs = true;
        //     }
        // }
        Logging.log2FB($scope.user_detail.email, "ends trig_code function in ItemListController");
    }
    $scope.trig_code = trig_code;

    function trig_color(event){
        Logging.log2FB($scope.user_detail.email, "starts trig_color function in ItemListController");
        $scope.showColorInput = true;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showSizeInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = false;
        $scope.toggleColor = true;
        $scope.toggleSize = false;

        $scope.filterLetters = "COM";

        // if($scope.showColorInput){
        //     $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        // }else{
        //     $scope.showColorInput = true;
        //     if(!$scope.showItemCodeInputs){
        //         $scope.showItemCodeInputs = true;
        //     }
        // }
        $scope.showItemList = !$scope.showColorInput;
        Logging.log2FB($scope.user_detail.email, "ends trig_color function in ItemListController");
    }
    $scope.trig_color = trig_color;

    function trig_size(event){
        Logging.log2FB($scope.user_detail.email, "starts trig_size function in ItemListController");
        $scope.showItemList = true;
        $scope.showSizeInput = true;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;

        $scope.toggleBrand = false;
        $scope.toggleCode = false;
        $scope.toggleColor = false;
        $scope.toggleSize = true;

        // if($scope.showSizeInput){
        //     $scope.showItemCodeInputs = !$scope.showItemCodeInputs;
        // }else{
        //     $scope.showSizeInput = true;
        //     if(!$scope.showItemCodeInputs){
        //         $scope.showItemCodeInputs = true;
        //     }
        // }
        Logging.log2FB($scope.user_detail.email, "ends trig_size function in ItemListController");
    }
    $scope.trig_size = trig_size;

    //---------------Custom Keyboard------------------------ 
    $scope.btn_brand= function(brand_id){
        Logging.log2FB($scope.user_detail.email, "starts btn_brand function in ItemListController");
        $scope.item_brand = brand_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = true;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.showBackButton = true;
        $scope.item_code = "";
        $scope.toggleBrand = false;
        $scope.toggleCode = true;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            $scope.allItemCodeEntered = true;
            console.log("all item entered");
        }
        Logging.log2FB($scope.user_detail.email, "ends btn_brand function in ItemListController");
        itemId();
    };

    $scope.btn_code= function(event){
        Logging.log2FB($scope.user_detail.email, "starts btn_code function in ItemListController");
        $scope.item_code = $scope.item_code + event.target.id;
        if($scope.item_brand.charAt( 0 ) == 'S' && $scope.item_brand.length == 1){
            if($scope.item_code.charAt(1)){
                if(!$scope.item_code.charAt(2)){
                    $scope.item_code = $scope.item_code + "-";
                }
            }
        }
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("all item entered");
            $scope.allItemCodeEntered = true;
        }
        Logging.log2FB($scope.user_detail.email, "ends btn_code function in ItemListController");
        itemId();
    };

    $scope.btn_code_ok = function(){
        Logging.log2FB($scope.user_detail.email, "starts btn_code_ok function in ItemListController");

        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = true;
        $scope.showSizeInput = false;
        $scope.toggleColor = true;
        $scope.toggleCode = false;
        $scope.showItemList = false;
        trig_color() //to set default color set button selection to COM - common
        Logging.log2FB($scope.user_detail.email, "ends btn_code_ok function in ItemListController");
        itemId();
    }

    $scope.btn_code_clear = function(){
        Logging.log2FB($scope.user_detail.email, "starts btn_code_clear function in ItemListController");
        $scope.item_code = '';
        Logging.log2FB($scope.user_detail.email, "ends btn_code_clear function in ItemListController");
        itemId();
    }

    $scope.btn_code_backspace = function(){
        Logging.log2FB($scope.user_detail.email, "starts btn_code_backspace function in ItemListController");
        $scope.item_code = $scope.item_code.substring(0, $scope.item_code.length - 1);
        Logging.log2FB($scope.user_detail.email, "ends btn_code_backspace function in ItemListController");
        itemId();
    }

    $scope.btn_color= function(color_id){
        Logging.log2FB($scope.user_detail.email, "starts btn_color function in ItemListController");
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
            console.log("all item entered");
            $scope.allItemCodeEntered = true;
        }
        Logging.log2FB($scope.user_detail.email, "ends btn_color function in ItemListController");
        itemId();
    };

    $scope.btn_size= function(size_id){
        Logging.log2FB($scope.user_detail.email, "starts btn_size function in ItemListController");
        $scope.item_size = size_id;
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = false;
        $scope.showSizeInput = false;
        $scope.toggleSize = false;
        if($scope.item_brand && $scope.item_code && $scope.item_color && $scope.item_size){
            console.log("all item entered");
            $scope.allItemCodeEntered = true;
        }
        Logging.log2FB($scope.user_detail.email, "ends btn_size function in ItemListController");

        itemId();
        // $scope.headerLabel = "ITEM : " + $scope.current.item_id;
    };

    $scope.filterColor = function(event){
        Logging.log2FB($scope.user_detail.email, "starts filterColor function in ItemListController");
        $ionicScrollDelegate.scrollTop();
        $scope.filterLetters = event.target.id;
        console.log("selected is " + $scope.filterLetters);
        Logging.log2FB($scope.user_detail.email, "ends filterColor function in ItemListController");

    };

    function itemId(){
        Logging.log2FB($scope.user_detail.email, "starts itemId function in ItemListController");
        $ionicScrollDelegate.scrollTop();
        Logging.log2FB($scope.user_detail.email, "ends itemId function in ItemListController");
    }

    
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
        Logging.log2FB($scope.user_detail.email, "starts confirmScanResult function in ItemListController");
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
                    if($scope.current.itemAddMode == "fromsale"){
                        $scope.current.item_id = barcodeData;
                        $state.go('main.sales_add');
                    }else if($scope.current.itemAddMode == "fromitem"){
                        itemExist(barcodeData);
                    }
                };
            } if(!res) {
                console.log('You are not sure');
                scanFunction();
            }
        });
        Logging.log2FB($scope.user_detail.email, "ends confirmScanResult function in ItemListController");
    };
    $scope.confirmScanResult = confirmScanResult;

    function itemExist(barcodeData){
        Logging.log2FB($scope.user_detail.email, "starts itemExist function in ItemListController");
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'Item Exist',
         template: 'Item <h2> ' + barcodeData+' </h2>already exist',
         okType: 'button-flat'
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
        Logging.log2FB($scope.user_detail.email, "ends itemExist function in ItemListController");
    };
    $scope.itemExist = itemExist;

    // console.log("show brand = " + $scope.showBrandInput);
    // console.log("show keyboard = " + $scope.showItemCodeInputs);
}])
