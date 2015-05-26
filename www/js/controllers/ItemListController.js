angular.module('starter.controllers')
.controller('ItemListController', ["$scope", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $ionicGesture, $state, $filter, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {

    $scope.headerLabel = "ITEM LIST : ";
    $scope.headerCloseButton = true;
    $scope.current.item_id ='';
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;

    updateItems();
    //** Make array to only include items ids and exclude $$conf, $id, $priority **
    
    $scope.current.item_brand = '';
    $scope.current.item_code = '';
    $scope.current.item_color = '';
    $scope.current.item_size = '';

    var brandbtns = ["HB", "F", "R", "H"];
    var colorbtns = ["BLK", "BLU", "GRN", "BRN"];
    var sizebtns = ["38", "39", "40", "41", "42", "43", "44", "45"];
    var allbtns = brandbtns.concat(colorbtns,sizebtns);

    if($state.current.name === "main.sales_scanadd"){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.current.item_id = barcodeData.text;
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

    function selectItem($item_id){
        console.log("sselectItem function called" + $item_id);
        $scope.current.item_id = $item_id;
        $state.go('main.sales_add');
    };
    $scope.selectItem = selectItem;

    $scope.addItem = function(){
        $state.go('main.items_add');
    }

    $scope.editItem = function($item_id) {
        $scope.current.item_id = $item_id;
        $scope.current.editItemKey = "true";
        $scope.current.editItemPrice = $scope.items[$item_id].retail_price;
        $state.go('main.items_add');
    }

    $scope.removeItem = function($item_id) {
        console.log("remove Item item_id: " + $item_id);
        Items.remove($item_id);
        $scope.items_array = Items.get_as_array();

    }

    

    function updateItems(){
        $scope.items = Items.get();
        $scope.items_array = Items.get_as_array();

        // $scope.items_ids = Object.keys($scope.items);
        // for(var i = $scope.items_ids.length - 1; i >= 0; i--) {
        //     if($scope.items_ids[i] === "$$conf") {
        //        $scope.items_ids.splice(i, 1);
        //     }
        //     if($scope.items_ids[i] === "$id") {
        //        $scope.items_ids.splice(i, 1);
        //     }
        //     if($scope.items_ids[i] === "$priority") {
        //        $scope.items_ids.splice(i, 1);
        //     }
        // }
    }
    $scope.$on(updateItems);

    $scope.$watch('current.item_id', function(val) {
        $scope.current.item_id = $filter('uppercase')(val);
    }, true);

       $scope.btn_brand= function(event){
                
        for (btn in brandbtns) {
            if (brandbtns[btn] == event.target.id){
                document.getElementById(brandbtns[btn]).className = "button active";
                $scope.current.item_brand = brandbtns[btn];
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
    };

    $scope.btn_code= function(event){
        $scope.current.item_code = $scope.current.item_code + event.target.id;
        itemId();
    };

    $scope.btn_code_ok = function(){
        $scope.showBrandInput = false;
        $scope.showCodeInput = false;
        $scope.showColorInput = true;
        $scope.showSizeInput = false;
    }

    $scope.btn_code_clear = function(){
        $scope.current.item_code = '';
        itemId();
    }

    $scope.btn_color= function(event){
        
        // $scope.ClearBg = {};
        for (btn in colorbtns) {
            if (colorbtns[btn] == event.target.id){
                document.getElementById(colorbtns[btn]).className = "button active";
                $scope.current.item_color = colorbtns[btn];
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
    };

    $scope.btn_size= function(event){
        
        // $scope.ClearBg = {};
        for (btn in sizebtns) {
            if (sizebtns[btn] == event.target.id){
                document.getElementById(sizebtns[btn]).className = "button active";
                $scope.current.item_size = sizebtns[btn];
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
    };

    $scope.itemIdClear= function(){
        $scope.current.item_brand = '';
        $scope.current.item_code ='';
        $scope.current.item_color ='';
        $scope.current.item_size = '';
        for (btn in allbtns) {
            document.getElementById(allbtns[btn]).className = "button";
        }
        itemId();
    };

    function itemId(){
        $scope.current.item_id = $scope.current.item_brand + $scope.current.item_code + $scope.current.item_color + $scope.current.item_size;
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
