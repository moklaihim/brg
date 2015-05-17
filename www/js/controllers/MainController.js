angular.module('starter.controllers')
.controller('MainController', ["$rootScope", "$scope", "$state", "$timeout", "$ionicPopup", "$cordovaNetwork", "$cordovaDatePicker", "Roles", "User", "currentUser", function($rootScope, $scope, $state, $timeout, $ionicPopup, $cordovaNetwork, $cordovaDatePicker, Roles, User, currentUser) {
    console.log("MainController started");
    console.log(currentUser);

    $scope.user = currentUser;
    $scope.roles = new Object();
    //$scope.user_detail = User.getUserDetail(currentUser.password.email);
    $scope.users = User.get_list();
    $scope.roles = Roles.get_list();
    if($scope.users.$loaded){
        $scope.users.$loaded().then(function(){
            console.log("Role is");
            //console.log($scope.u['role']);
            $scope.user_detail = User.getUserDetail(currentUser.password.email);
            if($scope.roles.$loaded){
                $scope.roles.$loaded().then(function() {
                    console.log($scope.roles[$scope.user_detail['role']]);
                    $scope.role = $scope.roles[$scope.user_detail['role']];
                });
            }else{
                $scope.user_detail = User.getUserDetail(currentUser.password.email);
                $scope.role = $scope.roles[$scope.user_detail['role']];
            }
        });
        // $timeout(function(){
        //     console.log("BRG Debug: user_detail Timed out");
        //     User.on_timeout();
        //     $scope.user_detail = User.getUserDetail(currentUser.password.email);
        // }, 5000)
    }else{
        $scope.user_detail = User.getUserDetail(currentUser.password.email);
        if($scope.roles.$loaded){
            $scope.roles.$loaded().then(function() {
                console.log($scope.roles[$scope.user_detail['role']]);
                $scope.role = $scope.roles[$scope.user_detail['role']];
            });
            // $timeout(function(){
            //     console.log("BRG Debug: store_array Timed out");
            //     Roles.on_timeout();
            //     $scope.roles = Roles.get_list();
            //     $scope.role = $scope.roles[User.getUserDetail(currentUser.password.email)['role']];
            // }, 5000)
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
        fb_restored: false
    };

    /*
    if(!$scope.current.fb_restored){
        OfflineFirebase.restore();
        $scope.current.fb_restored = true;
    }
    */

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
        if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
            $ionicPopup.alert({
                title: 'Information',
                template: "on mobile device"
            });
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
        }else{
            $scope.showPCDatePicker = !$scope.showPCDatePicker;
        }
    }

    $scope.$watch('current.raw_set_date', function(){
        setDate($scope.current.raw_set_date, false);
        $scope.showPCDatePicker = false;
    });

    $scope.logout = function(){
        console.log("logout started");
        User.logout();
        $scope.user = {};
        $state.go('login');
    };
}])
