angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "$state", "$ionicPopup", "Roles", function($scope, $state, $ionicPopup, Roles) {
    console.log("ReportListController started");
    $scope.current.view = 'reports_list';

    $scope.roles = Roles.get_list();

    $scope.update = function(){
        $scope.roles.$save();
    };

    $scope.cancel = function(){
        Roles.online();
        $scope.roles = Roles.get_list();
    };

}])
