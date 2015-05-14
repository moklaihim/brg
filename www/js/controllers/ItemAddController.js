angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$cordovaKeyboard", "$ionicGesture", "$filter", "$state", "Items", function($scope, $cordovaKeyboard, $ionicGesture, $filter, $state, Items) {
 
    $scope.new_item = {
        id: '',
        retail_price: ''
    } 
    $scope.item_brand = '';
    $scope.item_code = '';
    $scope.item_color = '';
    $scope.item_size = '';


    if ($scope.current.item_id){
        $scope.new_item.id = $scope.current.item_id;
        $scope.hideKBButtons=true;
    }

    $scope.ok = function(){
        Items.add($scope.new_item.id, $scope.new_item.retail_price);
        $scope.current.item_id = $scope.new_item.id;
        $state.go('main.sales_add');
    };

    $scope.cancel = function(){
        $scope.current.item_id ="";
        $state.go('main.sales_list');
    };

    $scope.btn_brand= function(event){
        var btns = ["HB", "F", "R", "H"];
        $scope.item_brand = event.target.id;
        for (btn in btns) {
            if (btns[btn] == $scope.item_brand){
                document.getElementById(btns[btn]).className = "button active";
            }
            else{
                document.getElementById(btns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_code= function(event){
        $scope.item_code = $scope.item_code + event.target.id;
        itemId();
    };

    $scope.btn_color= function(event){
        var btns = ["BLK", "BLU", "GRN", "BRN"];
        $scope.item_color =  event.target.id;
        for (btn in btns) {
            if (btns[btn] == $scope.item_color){
                document.getElementById(btns[btn]).className = "button active";
            }
            else{
                document.getElementById(btns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_size= function(event){
        var btns = ["38", "39", "40", "41", "42", "43", "44", "45"];
        $scope.item_size = event.target.id;
        for (btn in btns) {
            if (btns[btn] == $scope.item_size){
                document.getElementById(btns[btn]).className = "button active";
            }
            else{
                document.getElementById(btns[btn]).className = "button";
            }
        }
        itemId();
    };

    $scope.btn_price= function(event){
        $scope.new_item.retail_price = $scope.new_item.retail_price + event.target.id;
    };

    $scope.itemIdClear= function(){
        $scope.item_brand = '';
        $scope.item_code ='';
        $scope.item_color ='';
        $scope.item_size = '';
        $scope.ClearBg = {"background-color":"#f8f8f8", "border-color":"#b2b2b2"};
        itemId();
    };

    var itemCode = angular.element(document.querySelector('#itemCode'));
    $ionicGesture.on('tap', function(e) {
        console.log("hide");
        $scope.hideKBButtons = !$scope.hideKBButtons;
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

    function itemId(){
        $scope.new_item.id = $scope.item_brand + $scope.item_code + $scope.item_color + $scope.item_size;
        
    };
    $scope.itemId = itemId;


}])
