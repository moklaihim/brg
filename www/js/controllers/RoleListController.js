angular.module('starter.controllers')
.controller('RoleListController', ["$scope", "$state", "$ionicPopup", "Roles", function($scope, $state, $ionicPopup, Roles) {
    console.log("RoleListController started");
    $scope.current.view = 'roles_list';

    $scope.roles = Roles.get_list();

    $scope.update = function(){
        $scope.roles.$save();
    };

    $scope.cancel = function(){
        Roles.online();
        $scope.roles = Roles.get_list();
    };

}])
