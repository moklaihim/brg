angular.module('starter.controllers')
.controller('SettingsController', ["$scope", "$ionicPush", "Env", function($scope, $ionicPush, Env) {
    console.log("SettingsController started");
    $scope.current.view = 'settings_list';

    if(Env.isMobile()){
        $scope.checkForUpdates();
    }

    $scope.notificationChange = function(){
        if($scope.current.notificationEnabled){
            $ionicPush.register({
                canShowAlert: true, //Can pushes show an alert on your screen?
                canSetBadge: true, //Can pushes update app icon badges?
                canPlaySound: true, //Can notifications play a sound?
                canRunActionsOnWake: true, //Can run actions outside the app,
                onNotification: function(notification) {
                    // Handle new push notifications here
                    // console.log(notification);
                    return true;
                }
            });
        }else{
            $ionicPush.unregister();
        }
    }
}])
