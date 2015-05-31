angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$timeout", "$ionicPopup", "$cordovaDatePicker", "Roles", "Auth", "Users", "Env", "currentAuth", function($rootScope, $scope, $state, $timeout, $ionicPopup, $cordovaDatePicker, Roles, Auth, Users, Env, currentAuth) {
    console.log("MainController started");
    console.log(currentAuth);

    $scope.users = Users.get_list();
    $scope.roles = Roles.get_list();
    if($scope.users.$loaded){
        $scope.users.$loaded().then(function(){
            $scope.user_detail = Users.getUserDetail(currentAuth.password.email);
            if($scope.roles.$loaded){
                $scope.roles.$loaded().then(function() {
                    $scope.role = $scope.roles[$scope.user_detail['role']];
                });
            }else{
                $scope.role = $scope.roles[$scope.user_detail['role']];
            }
        });
    }else{
        $scope.user_detail = Users.getUserDetail(currentAuth.password.email);
        if($scope.roles.$loaded){
            $scope.roles.$loaded().then(function() {
                $scope.role = $scope.roles[$scope.user_detail['role']];
            });
        }else{
            $scope.role = $scope.roles[$scope.user_detail['role']];
        }
    }

    $scope.current = {
        store_id: '',
        store_name: '',
        today_year: '',
        today_month: '',
        today_day: '',
        today_date: '',
        set_year: '',
        set_month: '',
        set_day: '',
        set_date: '',
        raw_set_date: new Date(),
        item_id: '',
        item_key: '',
        editItemKey: '',
        editItemPrice:'',
        fb_restored: false,
        item_brand: '',
        item_code: '',
        item_color: '',
        item_size: '',
        view: '',
        user_id: ''
    };

    setDate(new Date(), true);

    if(window.localStorage.getItem('store_date') == $scope.current.today_date){
        $scope.current.store_id = window.localStorage.getItem('store_id');
        $scope.current.store_name = window.localStorage.getItem('store_name');
    }else{
        $state.go('main.stores_list');
    }

    function setDate(date, today){
        console.log(date);
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
        $scope.showPCDatePicker = !$scope.showPCDatePicker;
    }

    $scope.$watch('current.raw_set_date', function(){
        setDate($scope.current.raw_set_date, false);
        $scope.showPCDatePicker = false;
    });

    $scope.logout = function(){
        console.log("logout started");
        Auth.logout();
        $state.go('login');
    };
}])
