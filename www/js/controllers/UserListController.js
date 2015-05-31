angular.module('starter.controllers')
.controller('UserListController', ["$scope", "$state", "Users", function($scope, $state, Users) {
    console.log("UserListController started");
    $scope.current.view = 'users_list';
    $scope.users = Users.get_list();

    $scope.removeUser = function(user_id) {
        console.log("remove user: " + user_id);
        Users.remove(user_id);
    }

    $scope.addUser = function(){
        $state.go('main.users_add');
    }

    $scope.editUser = function(user_id) {
        console.log("Key clicked is : " + user_id) 
        $scope.current.user_id = user_id;
        $state.go('main.users_edit');
    }

}])
