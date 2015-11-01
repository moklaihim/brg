angular.module('starter.controllers')
.controller('RoleListController', ["$scope", "$state", "$ionicPopup", "roles", "Roles", "Env", "Logging", function($scope, $state, $ionicPopup, roles, Roles, Env, Logging) {
    console.log("RoleListController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('RoleListController');
    //}
    Logging.log2FB($scope.user_detail.email, "RoleListController started");
    $scope.current.view = 'roles_list';

    $scope.roles = roles;

    $scope.update = function(){
        Logging.log2FB($scope.user_detail.email, "starts update function in RoleListController");
        $scope.roles.$save();
        Logging.log2FB($scope.user_detail.email, "ends update function in RoleListController");
        updatedAlert();
    };

    $scope.cancel = function(){
        Logging.log2FB($scope.user_detail.email, "starts cancel function in RoleListController");
        Roles.online();
        $scope.roles = Roles.get_list();
        Logging.log2FB($scope.user_detail.email, "ends cancel function in RoleListController");
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
