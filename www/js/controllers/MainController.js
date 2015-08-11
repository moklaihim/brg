angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$ionicPopup", "$cordovaDatePicker", "Roles", "role", "Auth", "Users", "user", "Env", "currentAuth", function($rootScope, $scope, $state, $ionicPopup, $cordovaDatePicker, Roles, role, Auth, Users, user, Env, currentAuth) {
    console.log("BRG Debug: MainController started");

    $scope.user_detail = user;
    if(!$scope.user_detail.active){
        console.log("User disabled");
        logout();
    }
    $scope.role = role;

    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $scope.current = {
        app_version: 'web 1.0.0',
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
        item_brand: '',
        item_code: '',
        item_color: '',
        item_size: '',
        itemAddMode: '',
        retail_price: '',
        view: '',
        user_id: '',
        emailTo:'',
        emailCc:'',
        hasUpdate: false,
        isToday:'',
        nearestStore:'',
        notificationEnabled: true
    };

    setDate(new Date(), true);

    $scope.getStore = function(){
        if(window.localStorage.getItem('store_date') == $scope.current.today_date){
            $scope.current.store_id = window.localStorage.getItem('store_id');
            $scope.current.store_name = window.localStorage.getItem('store_name');
            $scope.current.nearestStore = window.localStorage.getItem('brg_nearestStore');
        }
    }

    $scope.checkStore = function(){
        if(window.localStorage.getItem('store_date') == $scope.current.today_date){
            $scope.current.store_id = window.localStorage.getItem('store_id');
            $scope.current.store_name = window.localStorage.getItem('store_name');
        }else{
            $state.go('main.stores_list');
        }
    }

    $scope.isMobile = function(){
        return Env.isMobile();
    };

    $scope.isOnline = function(){
        return Env.isOnline();
    };

    $scope.isConnected = function(){
        return Env.isConnected();
    };

    function logout(){
        console.log("logout started");
        window.localStorage.removeItem("brg_login_email");
        window.localStorage.removeItem("brg_login_password");
        window.localStorage.clear();
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
        var today_day = new Date();
        var max_date = new Date(today_day.getFullYear(), today_day.getMonth() + 1, today_day.getDate());
        var min_date = new Date(today_day.getFullYear(), today_day.getMonth() - 1, today_day.getDate());
        var myPopup = $ionicPopup.show({
            template: '<div date-picker="current.raw_new_set_date" view="date" max-view="date" min-view="date" min-date="' + min_date + '" max-date="' + max_date + '" auto-close="false"></div>',
            title: $scope.current.set_year,
            subTitle: weekday[$scope.current.raw_set_date.getDay()] + ', ' + month[$scope.current.raw_set_date.getMonth()] + ' ' + $scope.current.raw_set_date.getDate(),
            scope: $scope,
            buttons: [
                {
                    text: 'Go To Today',
                    type: 'button-flat',
                    onTap: function() {
                        $scope.current.raw_new_set_date = today_day;
                        $scope.current.raw_set_date = today_day;
                        setDate($scope.current.raw_set_date, true);
                        console.log("today date is true")
                    }
                },
                {
                    text: 'OK',
                    type: 'button-flat',
                    onTap: function() {
                        $scope.current.raw_set_date = $scope.current.raw_new_set_date;
                        console.log("$scope.current.raw_new_set_date = " + $scope.current.raw_new_set_date.setHours(0,0,0,0))
                        console.log("today_day = " + today_day.setHours(0,0,0,0))
                        if($scope.current.raw_new_set_date.setHours(0,0,0,0) === today_day.setHours(0,0,0,0)){
                            setDate($scope.current.raw_set_date, true);
                            console.log("today date is true")
                        }else{
                            setDate($scope.current.raw_set_date, false);
                            console.log("today date is false")
                        }
                    }
                }
            ]
        });
    };

    var user_active_watch = $scope.$watch('user_detail.active', function(){
        console.log("user_detail changed");
        if(!$scope.user_detail.active){
            console.log("User disabled detected by watch 1");
            logout();
        }
    }, false);

    var user_role_watch = $scope.$watch('user_detail.role', function(){
        var p_role = Roles.get_one($scope.user_detail.role);
        p_role.then(function(role_detail){
            console.log("role updated");
            $scope.role = role_detail;
        });
    }, false);

    var online_watch = $scope.$watch(Env.isOnline, function(val){
        console.log("isOnline changed");
        if(val == true){
            //user_active_watch();
 
            var p_user = Users.get_one(currentAuth.password.email, "email");
            
            p_user.then(function(user_detail){
                $scope.user_detail = user_detail;

                var p_role = Roles.get_one(user_detail.role);
                p_role.then(function(role_detail){
                    $scope.role = role_detail;
                });

                //$scope.$watch('user_detail', function(){
                    //console.log("user_detail changed");
                    /**
                    if(!$scope.user_detail.active){
                        console.log("User disabled detected by watch 2");
                        logout();
                    }
                    var p_role = Roles.get_one($scope.user_detail.role);
                    p_role.then(function(role_detail){
                        console.log("role updated");
                        $scope.role = role_detail;
                    });
                **/
                //}, true);
            
            });
            //online_watch();
        }
    }, false);


    /*
    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        $ionicUser.set("token", data.token);
    });
    */

    $scope.logout = function(){
        console.log("logout started");
        logout();
    };

    function showAlert(message){
        var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template: message,
            okType: 'button-flat'
        }); 
    };  
    $scope.showAlert = showAlert;
}])

