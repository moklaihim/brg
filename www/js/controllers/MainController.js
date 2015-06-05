angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$timeout", "$ionicPopup", "$cordovaDatePicker", "Roles", "role", "Auth", "Users", "user", "Env", "currentAuth", function($rootScope, $scope, $state, $timeout, $ionicPopup, $cordovaDatePicker, Roles, role, Auth, Users, user, Env, currentAuth) {
//.controller('MainController', ["$rootScope", "$scope", "$state", "$timeout", "$ionicPopup", "$cordovaDatePicker", "Roles", "Auth", "Users", "Env", "currentAuth", function($rootScope, $scope, $state, $timeout, $ionicPopup, $cordovaDatePicker, Roles, Auth, Users, Env, currentAuth) {
    console.log("MainController started");

    $scope.user_detail = user;
    if(!$scope.user_detail.active){
        console.log("User disabled");
        logout();
    }
    //$scope.roles = roles;
    //$scope.role = $scope.roles[$scope.user_detail['role']];
    $scope.role = role;

    /*
    console.log("Getting user");
    console.log($scope.user_detail);
    console.log("Getting role");
    console.log($scope.role);
    console.log("Getting role");
    console.log($scope.role);
    */

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
        // editItemKey: '',
        // editItemPrice:'',
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

    function logout(){
        console.log("logout started");
        Users.logout(currentAuth.password.email);
        Auth.logout();
        $state.go('login');
    }

    function setDate(date, today){
        //console.log(date);
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
    };

    $scope.$watch('current.raw_set_date', function(){
        setDate($scope.current.raw_set_date, false);
        $scope.showPCDatePicker = false;
    });

    var user_active_watch = $scope.$watch('user_detail.active', function(){
        if(!$scope.user_detail.active){
            console.log("User disabled detected by watch 1");
            logout();
        }
    });

    var online_watch = $scope.$watch(Env.isOnline, function(val){
        console.log("isOnline changed");
        if(val == true){
            user_active_watch();

            var p_user_detail = Users.get_one(currentAuth.password.email);
            p_user_detail.then(function(user_detail){
                $scope.user_detail = user_detail;

                var p_role_detail = Roles.get_one(user_detail.role);
                p_role_detail.then(function(role_detail){
                    $scope.role = role_detail;
                });

                $scope.$watch('user_detail.active', function(){
                    if(!$scope.user_detail.active){
                        console.log("User disabled detected by watch 2");
                        logout();
                    }
                });
            });
            online_watch();
        }   
    }, false);

    $scope.logout = function(){
        console.log("logout started");
        logout();
    };

}])
