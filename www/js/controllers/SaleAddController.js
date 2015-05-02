angular.module('starter.controllers')
.controller('SaleAddController', ["$scope", "$state", "$filter", "$cordovaBarcodeScanner", "$ionicPlatform","Items", "Sales", function($scope, $state, $filter, $cordovaBarcodeScanner, $ionicPlatform, Items, Sales) {

    $scope.showDisOption = false;

    $scope.query = {
        text: '' 
    };

    $scope.sale = {
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    $scope.items = Items.get();
    $scope.items_array = Items.get_as_array();

    if($state.current.name === "main.sales_scanadd"){
        $scope.showItemList = false;
        console.log ("state is main.sales_scanadd")
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    var item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(item_id)){
                        $scope.current.item_id = item_id;
                        // showAlert($scope.current.item_id);
                        $state.go('main.items_add');
                    };
                    
                    selectItem(item_id);
                    
                },  function(error) {

                    // An error occurred
                    });
        }); 
    };

    if(Sales.check_sales()){
        Sales.get($scope.current.store_id, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
    }
    

    console.log("Loaded Current Item: " + $scope.current.item_id);
    if($scope.current.item_id){
        console.log("Current Item exist: " + $scope.current.item_id);
        selectItem($scope.current.item_id);
    }else{
        $scope.showItemList = true;
    }

    $scope.showItemListPage = function(){
        $scope.showItemList = true;
        $scope.showSaleDetail = false;
    };

    function selectItem($item_id){
        console.log ("sselectItem function called")
        $scope.showItemList = false;
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = Number($scope.items[$item_id].retail_price);
        $scope.sale.qty = 1;
        $scope.showSaleDetail = true;
    };
    $scope.selectItem = selectItem;

    $scope.cancel = function(){
        $scope.current.item_id = "";
        $state.go('main.sales_list');
    };

    $scope.ok = function(){
        for (var i = 0; i < $scope.sale.qty; i++) {
            Sales.add($scope.sale.item_id, $scope.sale.sale_price, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
        }
        $scope.current.item_id = "";
        $state.go('main.sales_list');
    };

    $scope.addItem = function(){
        $state.go('main.items_add');
    }

    $scope.scanAddSalePage1 = function(){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    $scope.item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.items[$item_id] = {id: $item_id};
                        $scope.items.$save();
                        refreshItemArray();
                    };
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.showSalesView = false;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.dOption= function(){
        $scope.showDisOption = !$scope.showDisOption;
        console.log("button clicked");
    };

    $scope.$watch('query.text', function(val) {
        $scope.query.text = $filter('uppercase')(val);
    }, true);

    // Alert Function----------------------------------------
    // function showAlert($item_id){
    //     // var msg = item_id;
    //     var alertPopup = $ionicPopup.alert({
    //      title: 'Don\'t eat that!',
    //      template: $item_id
    //     });
    //     alertPopup.then(function(res) {
    //      console.log('Thank you for not eating my delicious ice cream cone');
    //     });
    // };
    // $scope.showAlert = showAlert;

}])
