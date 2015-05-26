angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$cordovaKeyboard", "$ionicGesture", "$filter", "$state", "Items", function($scope, $cordovaKeyboard, $ionicGesture, $filter, $state, Items) {
 

    $scope.new_item = {
        retail_price: ''
    } 

    $scope.headerLabel = "ADD ITEM ";
    $scope.hideAddSaleBtn = false;
    $scope.hideEditItemBtn = true;
    $scope.hideAddItemBtn = false;
    $scope.hideItemClearBtn = false;
    $scope.showBrandInput = true;
    $scope.showColorInput = false;
    $scope.showSizeInput = false;
    $scope.showCodeInput = false;


    var brandbtns = ["HB", "F", "R", "H"];
    var colorbtns = ["BLK", "BLU", "GRN", "BRN"];
    var sizebtns = ["38", "39", "40", "41", "42", "43", "44", "45"];
    var allbtns = brandbtns.concat(colorbtns,sizebtns);


    if($scope.current.item_id){
        $scope.hideKBButtons=true;
        if ($scope.current.editItemKey){
            $scope.headerLabel = "EDIT ITEM ";
            $scope.hideAddSaleBtn = true;
            $scope.hideAddItemBtn = true;
            $scope.hideEditItemBtn = false;
            $scope.hideItemClearBtn = true;
        }else{
            $scope.headerLabel = "ADD ITEM ";
            $scope.current.editItemPrice = '';
            // $scope.hideAddSaleBtn = true;
            // $scope.hideEditItemBtn = true;
        }
    }else{
        $scope.current.editItemPrice = '';
    }
    // else if ($state.current.name === "main.sales_scanadd"){
    //     $scope.showItemList = false;
    // }else{
    //     $scope.showItemList = true;
    // }

    $scope.addItemOK = function(){
        Items.add($scope.current.item_id, $scope.new_item.retail_price);
        $scope.current.item_id = '';
        $state.go('main.sales_list');
    };

    $scope.editItemOK = function(){
        Items.add($scope.current.item_id, $scope.new_item.retail_price);
        $scope.current.editItemKey = '';
        $scope.current.editItemPrice = '';
        $scope.current.item_id = '';
        $state.go('main.items_list');
    };

    $scope.addSaleOK = function(){
        Items.add($scope.current.item_id, $scope.new_item.retail_price);
        $state.go('main.sales_add');
    };

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
        
        $scope.ClearBg = {};
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
        
        $scope.ClearBg = {};
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

    $scope.btn_price= function(event){
        $scope.new_item.retail_price = $scope.new_item.retail_price + event.target.id;
        $scope.current.editItemPrice = $scope.new_item.retail_price;
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

        // $scope.ClearBg = {"background-color":"#f8f8f8", "border-color":"#b2b2b2"};
        itemId();
    };

    function itemId(){
        $scope.current.item_id= $scope.current.item_brand + $scope.current.item_code + $scope.current.item_color + $scope.current.item_size;
    };
    $scope.itemId = itemId;

    var itemCode = angular.element(document.querySelector('#itemCode'));
    $ionicGesture.on('tap', function(e) {
        if ($scope.current.editItemKey){
        $scope.hideKBButtons = true;
        }else{
            $scope.showBrandInput = true;
            $scope.showCodeInput = false;
            $scope.showColorInput = false;
            $scope.showSizeInput = false;
        }   
        $scope.$digest();
        // if($scope.hideKBButtons == false)
        // {
        //     console.log("hide device keyboard");
        //     $cordovaKeyboard.close();

        // }
    }, itemCode);


    // var retailPrice = angular.element(document.querySelector('#retailPrice'));
    // $ionicGesture.on('tap', function(e) {
    //     console.log("hide2");
    //     $scope.hideNUMButtons = !$scope.hideNUMButtons;
    //     $scope.$digest();
    // }, retailPrice);


    $scope.$watch('new_item.id', function(val) {
        $scope.new_item.id = $filter('uppercase')(val);
    }, true);

}])
