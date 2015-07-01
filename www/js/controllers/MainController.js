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

    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        raw_new_set_date: new Date(),
        item_id: '',
        item_key: '',
        // editItemKey: '',
        // editItemPrice:'',
        fb_restored: false,
        item_brand: '',
        item_code: '',
        item_color: '',
        item_size: '',
        itemAddMode: '',
        retail_price: '',
        view: '',
        user_id: ''
    };

    setDate(new Date(), true);

    $scope.checkStore = function(){
        if(window.localStorage.getItem('store_date') == $scope.current.today_date){
            $scope.current.store_id = window.localStorage.getItem('store_id');
            $scope.current.store_name = window.localStorage.getItem('store_name');
        }else{
            $state.go('main.stores_list');
        }
    }

    function logout(){
        console.log("logout started");
        window.localStorage.removeItem("brg_login_email");
        window.localStorage.removeItem("brg_login_password");
        Users.logout(currentAuth.password.email);
        Auth.logout();
        $state.go('login');
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
        var myPopup = $ionicPopup.show({
            template: '<div date-picker="current.raw_new_set_date" view="date" max-view="date" min-view="date" auto-close="false"></div>',
            title: $scope.current.set_year,
            subTitle: weekday[$scope.current.raw_set_date.getDay()] + ', ' + month[$scope.current.raw_set_date.getMonth()] + ' ' + $scope.current.raw_set_date.getDate(),
            scope: $scope,
            buttons: [
                {
                    text: 'CANCEL',
                    type: 'button-flat',
                    onTap: function() {
                        $scope.current.raw_new_set_date = $scope.current.raw_set_date;
                    }
                },
                {
                    text: 'OK',
                    type: 'button-flat',
                    onTap: function() {
                        var today_day = new Date();
                        var max_date = new Date(today_day.getFullYear(), today_day.getMonth() + 1, today_day.getDate());
                        var min_date = new Date(today_day.getFullYear(), today_day.getMonth() - 1, today_day.getDate());

                        if($scope.current.raw_new_set_date > min_date && $scope.current.raw_new_set_date < max_date){
                            $scope.current.raw_set_date = $scope.current.raw_new_set_date;
                            setDate($scope.current.raw_set_date, false);
                        }else{
                            console.log("Date over limit");
                            $scope.current.raw_new_set_date = $scope.current.raw_set_date;
                            showAlert();
                        }
                    }
                }
            ]
        });
    };
/*
    $scope.$watch('current.raw_set_date', function(){
        setDate($scope.current.raw_set_date, false);
        //$scope.showPCDatePicker = false;
    });
*/

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

    function showAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'Error',
         template: 'You can only access 1 month before or after today',
         okType: 'button-flat'
        }); 
        alertPopup.then(function(res) {
         console.log('over scroll');
        }); 
    };  
}])
