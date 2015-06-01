angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$ionicGesture", "$state", "$filter", "$ionicPopup", "$ionicHistory", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $ionicGesture, $state, $filter, $ionicPopup, $ionicHistory, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {
    $scope.showDisOption = false;

    $scope.sale = {
        // sale_key: '',
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.sales = Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);

    console.log("Loaded Current Item: " + $scope.current.item_id);
    if($scope.current.item_id){
        $scope.headerLabel = "ADDING SALES : ";
        $scope.sale.item_id = $scope.current.item_id;
        $scope.sale.retail_price = $scope.items[$scope.current.item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = Number($scope.items[$scope.current.item_id].retail_price);
        $scope.sale.qty = 1;

    }else if ($scope.current.item_key){
        $scope.hideQtyField = true;
        $scope.sales.$loaded().then(function(){
            $scope.headerLabel = "EDITING SALES : ";
            $scope.sale.item_id = $scope.sales[$scope.current.item_key].item;
            $scope.sale.sale_price = Number($scope.sales[$scope.current.item_key].price);
            $scope.sale.retail_price = $scope.items[$scope.sale.item_id].retail_price;
            $scope.sale.discount_rate = 100 -($scope.sale.sale_price / $scope.sale.retail_price * 100);
        });
    }else if ($state.current.name === "main.sales_scanadd"){
        $scope.showItemList = false;
    }else{
        $scope.showItemList = true;
    }

    $scope.cancel = function(){
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        if ($scope.current.item_key){
            Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, $scope.current.item_key);
        }else {
            for (var i = 0; i < $scope.sale.qty; i++) {
                console.log("Sale_key FAIL in Sales.js")
                Sales.add($scope.current.store_id, $scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day, false);
            }
        }
        $scope.current.item_id = "";
        $scope.current.item_key = "";
        $ionicHistory.nextViewOptions({
              historyRoot: true
        });
        $state.go('main.sales_list');
    };

    $scope.dOption= function(){
        $scope.showDisOption = !$scope.showDisOption;
        console.log("button clicked");
    };

    $scope.dButton= function(event){
        // var disc = event.target.id;
        $scope.showDisOption = !$scope.showDisOption;
        $scope.sale.discount_rate = event.target.id;
        $scope.sale.sale_price = $scope.sale.retail_price - $scope.sale.retail_price * disc / 100;

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
    // $scope.$digest();

}])
