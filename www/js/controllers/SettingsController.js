angular.module('starter.controllers')
.controller('SettingsController', ["$scope", "Env", "user", "Users", "$cordovaAppVersion", "$cordovaGoogleAnalytics", function($scope, Env, user, Users, $cordovaAppVersion, $cordovaGoogleAnalytics) {
    console.log("SettingsController started");
    if(Env.isMobile()){
      $cordovaGoogleAnalytics.trackView('SettingsController');
    }
    $scope.current.view = 'settings_list';

    // $scope.current.emailTo = user.reportSendTo;
    // $scope.current.emailCc = user.reportSendCc;
    //console.log("send to email "+ user.reportSendTo);

    console.log(user);

    $scope.user_detail = {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
        storeIC: user.storeIC,
        reportTo: user.reportTo,
        reportCc: user.reportCc
    };

    $scope.reportEmailUpdate = function(){
        $scope.user_detail.reportTo = $scope.user_detail.reportTo.replace(/ /g,"");
        $scope.user_detail.reportCc = $scope.user_detail.reportCc.replace(/ /g,"");
        user.reportTo = $scope.user_detail.reportTo;
        user.reportCc = $scope.user_detail.reportCc;
        Users.edit($scope.user_detail);
        $scope.showAlert("Notification", "Updated");
    };

    $scope.addToList = function(){
        $scope.user_detail.emailTo = $scope.user_detail.emailTo + ',';
        //var sendToElem = angular.element(document.getElementById('sendTo'));
        //sendToElem.focus();
        //$("#sendTo").focus();
        //$scope.toFocus=true;
        //console
        // document.getElementById("sendTo").focus();
    };

    $scope.addCcList = function(){
        $scope.user_detail.emailCc = $scope.user_detail.emailCc + ',';
        // user.reportSendCc.push(user_detail.emailCc);
        // Users.edit($scope.user_detail);
    };

    if(Env.isMobile()){
        //$cordovaAppVersion.getAppVersion(function(version) {
        //    $scope.current.app_version = version;
        //});
        checkForUpdates();
    }


    //$scope.notificationChange = function(){
        //if($scope.current.notificationEnabled){
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
        //}else{
            //$ionicPush.unregister();
        //}
    //};

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
        /*
        if($scope.current.hasUpdate){
            $ionicDeploy.update().then(function(res) {
                console.log('Ionic Deploy: Update Success! ', res);
            }, function(err) {
                console.log('Ionic Deploy: Update error! ', err);
            }, function(prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            }); 
        }   
        */
    };  

    // Check Ionic Deploy for new code
    function checkForUpdates(){
        /*
        console.log('Ionic Deploy: Checking for updates');
        $ionicDeploy.check().then(function(hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            $scope.current.hasUpdate = hasUpdate;
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        }); 
        */
    };
}])
