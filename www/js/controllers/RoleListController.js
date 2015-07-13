angular.module('starter.controllers')
.controller('RoleListController', ["$scope", "$state", "$ionicPopup", "roles", "Roles", function($scope, $state, $ionicPopup, roles, Roles) {
    console.log("RoleListController started");
    $scope.current.view = 'roles_list';

    $scope.roles = roles;

    $scope.update = function(){
        $scope.roles.$save();
        updatedAlert();
    };

    $scope.cancel = function(){
        Roles.online();
        $scope.roles = Roles.get_list();
    };

    function updatedAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'Roles',
         template: 'Updated',
         okType: 'button-flat'
        });
        // alertPopup.then(function(res) {
        //  console.log('Thank you for different date');
        // });
    };
    $scope.updatedAlert = updatedAlert;

}])
