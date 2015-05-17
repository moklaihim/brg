angular.module('starter.controllers')
.controller('RoleListController', ["$scope", "$state", "$ionicPopup", "$ionicListDelegate", "Roles", function($scope, $state, $ionicPopup, $ionicListDelegate, Roles) {
    console.log("RoleListController started");

    $scope.roles = Roles.get_list();

    $scope.update = function(){
        $scope.roles.$save();
    };

    $scope.cancel = function(){
        $scope.roles = Roles.reload_list();
    };

}])
