angular.module('starter.controllers')
.controller('CodeListController', ["$scope", "$state", "$ionicPopup", "Roles", function($scope, $state, $ionicPopup, Roles) {
    console.log("CodeListController started");
    $scope.current.view = 'codes_list';

    $scope.roles = Roles.get_list();

    $scope.update = function(){
        $scope.roles.$save();
    };

    $scope.cancel = function(){
        Roles.online();
        $scope.roles = Roles.get_list();
    };

}])
