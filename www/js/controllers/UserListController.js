angular.module('starter.controllers')
.controller('UserListController', ["$scope", "$state", "Users", "users", "roles", "Env", "Logging", function($scope, $state, Users, users, roles, Env, Logging) {
    console.log("UserListController started");
    Logging.log2FB($scope.user_detail.email, "UserListController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('UserListController');
    //}
    $scope.current.view = 'users_list';

    $scope.users = users;
    $scope.roles = roles;

    $scope.removeUser = function(user_id) {
        Logging.log2FB($scope.user_detail.email, "starts removeUser function in UserListController");
        console.log("remove user: " + user_id);
        Users.remove(user_id);
        Logging.log2FB($scope.user_detail.email, "ends removeUser function in UserListController");
    };

    $scope.addUser = function(){
        Logging.log2FB($scope.user_detail.email, "starts addUser function in UserListController");
        $state.go('main.users_add');
        Logging.log2FB($scope.user_detail.email, "ends addUser function in UserListController");
    };

    $scope.editUser = function(user_id) {
        Logging.log2FB($scope.user_detail.email, "starts editUser function in UserListController");
        console.log("Key clicked is : " + user_id) 
        $scope.current.user_id = user_id;
        $state.go('main.users_edit');
        Logging.log2FB($scope.user_detail.email, "ends editUser function in UserListController");
    };

}])
