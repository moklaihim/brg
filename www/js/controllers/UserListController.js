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
        console.log("remove user: " + user_id);
        Users.remove(user_id);
    };

    $scope.addUser = function(){
        $state.go('main.users_add');
    };

    $scope.editUser = function(user_id) {
        console.log("Key clicked is : " + user_id) 
        $scope.current.user_id = user_id;
        $state.go('main.users_edit');
    };

}])
