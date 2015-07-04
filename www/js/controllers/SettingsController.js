angular.module('starter.controllers')
.controller('SettingsController', ["$scope", "Env", function($scope, Env) {
    console.log("SettingsController started");
    $scope.current.view = 'settings_list';

    if(Env.isMobile()){
        $scope.checkForUpdates();
    }
}])
