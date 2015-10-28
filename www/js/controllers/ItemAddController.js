angular.module('starter.controllers')
.controller('ItemAddController', ["$scope", "$state", "$ionicPopup", "$ionicHistory", "$ionicPlatform", "Items", "Sales", "Codes", "Env", "Logging", function($scope, $state, $ionicPopup, $ionicHistory, $ionicPlatform, Items, Sales, Codes, Env, Logging) {
// Start of Item List to show only item list and Brand input
//
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('ItemAddController');
    //}
    Logging.log2FB($scope.user_detail.email, "ItemAddController started");
    $scope.current.view = 'items_add';
    $scope.headerLabel = "Items add/edit";  // header will reflect ITEM List
    $scope.showAddSaleBtn = false;
    $scope.showAddItemBtn = false;
    $scope.showEditItemBtn = false;
    $scope.showPriceInput = true;

    console.log("itemaddmode = " + $scope.current.itemAddMode);

    if($scope.current.itemAddMode == 'fromsale'){
        $scope.showAddSaleBtn = true;
    }
    if($scope.current.itemAddMode == 'fromitem'){
        $scope.showAddItemBtn = true;
    }
    if($scope.current.itemAddMode == 'fromedit'){
        $scope.showEditItemBtn = true;
    }


    $scope.addSaleOK = function(){
        if (!$scope.current.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered
            return;
        };

        Items.add($scope.current.item_id, $scope.current.retail_price);
        $state.go('main.sales_add');
        // $scope.current.item_id = ''
        // $scope.current.retail_price = '';
        priceClear();

    };

    $scope.addItemOK = function(){
        if (!$scope.current.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered
            return;
        };

        Items.add($scope.current.item_id, $scope.current.retail_price);
        showItemAddAlert();
        $scope.current.item_id = '';
        $scope.current.retail_price = '';
        $state.go('main.items_list');
    };

    $scope.editItemOK = function(){
        if (!$scope.current.retail_price || $scope.current.item_id == '--'){
            showItemAddError(); //display error notification when price is not entered 
            return;
        };
        Items.add($scope.current.item_id, $scope.current.retail_price);
        $scope.current.item_id = ''
        $scope.current.retail_price = '';
        $state.go('main.items_list');
    };

    $scope.btn_price = function(event){
        $scope.current.retail_price = $scope.current.retail_price + event.target.id;
    };

    $scope.priceToggle = function(){
        console.log("button togglePrice pressed");
        $scope.showPriceInput=true;
        $scope.current.retail_price='';
    };

    $scope.priceBackSpace = function(){
        $scope.showPriceInput=true;
        if($scope.current.retail_price.slice(-1) == '.'){
            $scope.current.retail_price = $scope.current.retail_price.slice(0, -2);
        }else{
            $scope.current.retail_price = $scope.current.retail_price.slice(0, -1);
        }
    };

    //When the X button beside the Retail Price is clicked
    function priceClear(){
        $scope.current.retail_price = '';
    };
    $scope.priceClear = priceClear;
    //Build item_id when individual input is keyed in

    // ------------------------------Alert Function----------------------------

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
