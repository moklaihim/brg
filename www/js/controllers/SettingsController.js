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
    };

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
        if($scope.current.hasUpdate){
            $ionicDeploy.update().then(function(res) {
                console.log('Ionic Deploy: Update Success! ', res);
            }, function(err) {
                console.log('Ionic Deploy: Update error! ', err);
            }, function(prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            }); 
        }   
    };  

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
        console.log('Ionic Deploy: Checking for updates');
        $ionicDeploy.check().then(function(hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            $scope.current.hasUpdate = hasUpdate;
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        }); 
    };
}])
