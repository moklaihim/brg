angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$ionicHistory", "$ionicPopup", "$cordovaDatePicker", "Roles", "role", "Auth", "Users", "Items", "user", "Env", "currentAuth", "Logging", function($rootScope, $scope, $state, $ionicHistory, $ionicPopup, $cordovaDatePicker, Roles, role, Auth, Users, Items, user, Env, currentAuth, Logging) {
    console.log("BRG Debug: MainController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('MainController');
    //  $cordovaGoogleAnalytics.setUserId(currentAuth.password.email);
    //}
    $scope.user_detail = user;
    Logging.log2FB($scope.user_detail.email, "MainController started");

    if(!$scope.user_detail.active){
        Logging.log2FB($scope.user_detail.email, "User disabled");
        console.log("User disabled");
        logout();
    }
    $scope.role = role;

    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    Env.conMon();

    $scope.current = {
        app_version: 'web 1.0.0',
        store_id: '',
        store_name: '',
        store_short_name: '',
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
        itemUpdated:false,
        nearestStore:'',
        notificationEnabled: true
    };

    setDate(new Date(), true);

    $scope.getStore = function(){
        Logging.log2FB($scope.user_detail.email, "starts getStore function in MainController");

        if(window.localStorage.getItem('store_date') == $scope.current.today_date){
            $scope.current.store_id = window.localStorage.getItem('store_id');
            $scope.current.store_name = window.localStorage.getItem('store_name');
            $scope.current.store_short_name = window.localStorage.getItem('store_short_name');
            $scope.current.nearestStore = window.localStorage.getItem('brg_nearestStore');
        }
        Logging.log2FB($scope.user_detail.email, "ends getStore function in MainController");

    }

    $scope.checkStore = function(){
        Logging.log2FB($scope.user_detail.email, "starts checkStore function in MainController");
        
        if(window.localStorage.getItem('store_date') == $scope.current.today_date){
            $scope.current.store_id = window.localStorage.getItem('store_id');
            $scope.current.store_name = window.localStorage.getItem('store_name');
            $scope.current.store_short_name = window.localStorage.getItem('store_short_name');
        }else{
            $state.go('main.stores_list');
        }
        Logging.log2FB($scope.user_detail.email, "ends checkStore function in MainController");
    }

    $scope.isMobile = function(){
        Logging.log2FB($scope.user_detail.email, "starts isMobile function in MainController");
        return Env.isMobile();
        Logging.log2FB($scope.user_detail.email, "ends isMobile function in MainController");
    };

    $scope.isOnline = function(){
        // Logging.log2FB($scope.user_detail.email, "starts isOnline function in MainController");
        return Env.isOnline();
        // Logging.log2FB($scope.user_detail.email, "ends isOnline function in MainController");
    };

    $scope.isConnected = function(){
        // Logging.log2FB($scope.user_detail.email, "starts isConnected function in MainController");
        return Env.isConnected();
        // Logging.log2FB($scope.user_detail.email, "ends isConnected function in MainController");
    };

    function logout(){
        Logging.log2FB($scope.user_detail.email, "starts logout function in MainController");
        console.log("logout started");
        //window.localStorage.removeItem("brg_login_email");
        //window.localStorage.removeItem("brg_login_password");
        window.localStorage.clear();
        //Users.logout(currentAuth.password.email);
        Auth.logout();
        Logging.log2FB($scope.user_detail.email, "ends logout function in MainController");
        $state.go('login');
    }

    function setDate(date, today){
        Logging.log2FB($scope.user_detail.email, "starts setDate function in MainController");
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        if (month < 10) { month = '0' + month; }
        var day = date.getDate();
        if (day < 10) { day = '0' + day; }
        if (today){
            $scope.current.today_year = year;
            $scope.current.today_month = month;
            $scope.current.today_day = day;
            $scope.current.today_date = day + "/" + month + "/" + year;
        }
        $scope.current.set_year = year;
        $scope.current.set_month = month;
        $scope.current.set_day = day;
        $scope.current.set_date = day + "/" + month + "/" + year;
        console.log("Date changed: " + $scope.current.today_date + " " + $scope.current.set_date);
        $rootScope.$broadcast('changedDate');
        Logging.log2FB($scope.user_detail.email, "ends setDate function in MainController");
    }

    $scope.showDatePicker = function(){
        Logging.log2FB($scope.user_detail.email, "starts showDatePicker function in MainController");
        var today_day = new Date();
        var max_date = new Date(today_day.getFullYear(), today_day.getMonth() + 1, today_day.getDate());
        var min_date = new Date(today_day.getFullYear() - 1, today_day.getMonth() - 1, today_day.getDate());
        // console.log("today_day: ", today_day);
        // console.log("min_date: ", min_date);
        // console.log("max_date: ", max_date);
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
    Logging.log2FB($scope.user_detail.email, "ends showDatePicker function in MainController");
    };

    var user_active_watch = $scope.$watch('user_detail.active', function(){
        Logging.log2FB($scope.user_detail.email, "starts user_active_watch function in MainController");
        console.log("user_detail changed");
        if(!$scope.user_detail.active){
            console.log("User disabled detected by watch 1");
            logout();
        }
        Logging.log2FB($scope.user_detail.email, "ends user_active_watch function in MainController");
    }, false);

    var user_role_watch = $scope.$watch('user_detail.role', function(){
        Logging.log2FB($scope.user_detail.email, "starts user_role_watch function in MainController");
        var p_role = Roles.get_one($scope.user_detail.role);
        p_role.then(function(role_detail){
            console.log("role updated");
            $scope.role = role_detail;
        });
        Logging.log2FB($scope.user_detail.email, "ends user_role_watch function in MainController");
    }, false);

    var online_watch = $scope.$watch(Env.isOnline, function(val){
        Logging.log2FB($scope.user_detail.email, "starts online_watch function in MainController");
        console.log("isOnline changed");
        if(val == true){
            //user_active_watch();
 
            //var p_user = Users.get_one(currentAuth.password.email, "email");
            var p_user = Users.get_one(currentAuth.email, "email");
            
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
        Logging.log2FB($scope.user_detail.email, "ends online_watch function in MainController");
    }, false);


    /*
    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        $ionicUser.set("token", data.token);
    });
    */

    $scope.back = function(){
        Logging.log2FB($scope.user_detail.email, "starts back function in MainController");
        if($scope.current.view == 'store_list'){
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go('main.sales_list');
        }else{
            $ionicHistory.goBack();
        }
        Logging.log2FB($scope.user_detail.email, "ends back function in MainController");
    };

    $scope.logout = function(){
        Logging.log2FB($scope.user_detail.email, "starts logout function in MainController");
        console.log("logout started");
        logout();
        Logging.log2FB($scope.user_detail.email, "ends logout function in MainController");
    };

    function showAlert(title, message){
        Logging.log2FB($scope.user_detail.email, "starts showAlert function in MainController");
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message,
            okType: 'button-flat'
        }); 
        Logging.log2FB($scope.user_detail.email, "ends showAlert function in MainController");
    };  
    $scope.showAlert = showAlert;
}])

