angular.module('starter.controllers')
.controller('SettingsController', ["$scope", "$ionicDeploy", "$ionicPopup", "Env", "user", "Users", function($scope, $ionicDeploy, $ionicPopup, Env, user, Users) {
    console.log("SettingsController started");
    $scope.current.view = 'settings_list';

    // $scope.current.emailTo = user.reportSendTo;
    // $scope.current.emailCc = user.reportSendCc;

    $scope.user_detail = {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
        emailTo: user.reportSendTo,
        emailCc: user.reportSendCc
    };

    $scope.reportEmailUpdate = function(){
        Users.edit($scope.user_detail);
        confirmedAlert();
    };

    $scope.addToList = function(){
        $scope.user_detail.emailTo = $scope.user_detail.emailTo + ',';
    };

    $scope.addCcList = function(){
        $scope.user_detail.emailCc = $scope.user_detail.emailCc + ',';
    };

    if(Env.isMobile()){
        cordova.getAppVersion(function(version) {
            $scope.current.app_version = version;
        });
        checkForUpdates();
    }


    $scope.notificationChange = function(){
        if($scope.current.notificationEnabled){
            /*
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
            */
        }else{
            //$ionicPush.unregister();
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
    function checkForUpdates(){
        console.log('Ionic Deploy: Checking for updates');
        $ionicDeploy.check().then(function(hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            $scope.current.hasUpdate = hasUpdate;
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        }); 
    };

    function confirmedAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'Notification',
         template: 'Updated',
         okType: 'button-flat'
        });
    };
    $scope.confirmedAlert = confirmedAlert;
}])
