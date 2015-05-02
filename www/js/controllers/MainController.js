angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$cordovaDatePicker", function($rootScope, $scope, $state, $cordovaDatePicker) {
    console.log("MainController started");
    
    $scope.current = {
        store_id: '',
        store_name: '',
        store_item: '',
        today_year: '',
        today_month: '',
        today_day: '',
        today_date: '',
        set_year: '',
        set_month: '',
        set_day: '',
        set_date: '',
        item_id: ''
    };

    setDate(new Date(), true);

    if(window.localStorage.getItem('store_date') == $scope.current.today_date){
        $scope.current.store_id = window.localStorage.getItem('store_id');
        $scope.current.store_name = window.localStorage.getItem('store_name');
    }else{
        $state.go('main.stores_list');
    }

    function setDate(date, today){
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        if (month < 10) { month = '0' + month; }
        var day = date.getDate();
        if (day < 10) { day = '0' + day; }
        if (today){
            $scope.current.today_year = year;
            $scope.current.today_month = month;
            $scope.current.today_day = day;
            $scope.current.today_date = year + "/" + month + "/" + day;
        }
        $scope.current.set_year = year;
        $scope.current.set_month = month;
        $scope.current.set_day = day;
        $scope.current.set_date = year + "/" + month + "/" + day;
        console.log("Date changed: " + $scope.current.today_date + " " + $scope.current.set_date);
        $rootScope.$broadcast('changedDate');
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
            setDate(date, false);
        });
    };
}])
