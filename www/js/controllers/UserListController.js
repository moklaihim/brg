angular.module('starter.controllers')
.controller('UserListController', ["$scope", "$state", "$cordovaGoogleAnalytics", "Users", "users", "roles", function($scope, $state, $cordovaGoogleAnalytics, Users, users, roles) {
    console.log("UserListController started");
    $cordovaGoogleAnalytics.trackView('UserListController');
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
