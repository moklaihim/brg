angular.module('starter.controllers')
.controller('SaleListController', ["$scope", "$state", "$cordovaDatePicker", "Sales", "Stores", function($scope, $state, $cordovaDatePicker, Sales, Stores) {
    console.log("SaleListController started");
    setDate(new Date());

    var current_store = Stores.get_current();
    if(Object.keys(current_store).length === 0){
        $state.go('tab.stores_list');
    }
    $scope.store_id = current_store.id;
    $scope.store_name = current_store.name;
    $scope.sales = Sales.get($scope.store_id, $scope.year, $scope.month, $scope.day);
    console.log("Current Store" +  $scope.store_id + " " + $scope.store_name);

    function setDate(date){
        //var today=new Date(); 
        $scope.year = date.getFullYear();
        $scope.month = date.getMonth()+1;
        if ($scope.month < 10) { $scope.month = '0' + $scope.month; }
        $scope.day = date.getDate();
        if ($scope.day < 10) { $scope.day = '0' + $scope.day; }
        $scope.date = $scope.year + "/" + $scope.month + "/" + $scope.day;
        $scope.currentHr = date.getHours();
        $scope.currentMin = date.getMinutes();
        $scope.currentTime = $scope.currentHr + ":" + $scope.currentMin;
        $scope.sales = Sales.get(Stores.current_store_id, $scope.year, $scope.month, $scope.day);
    }

    $scope.showDatePicker = function(){
        var options = {
            mode: 'date',
            date: new Date(),
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
            setDate(date);
        });
    };

    $scope.removeSale = function(key) {
        console.log("remove key: " + key);
        Sales.remove(key);
    };
}])
