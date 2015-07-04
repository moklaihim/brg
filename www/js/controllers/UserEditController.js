angular.module('starter.controllers')
.controller('UserEditController', ["$scope", "$ionicHistory", "$state", "Roles", "Users", function($scope, $ionicHistory, $state, Roles, Users) {

    $scope.roles = Roles.get_list();

    if ($state.current.name === "main.users_add"){
        // Adding new user
        $scope.user_detail = {
            email: '',
            id: '',
            name: '',
            role: '',
            password: ''
        }
    }else{
        // Editing existing user
        var p_user = Users.get_one($scope.current.user_id, "id");
        p_user.then(function(user_detail){
            $scope.user_detail = {
                email: user_detail.email,
                id: user_detail.id,
                name: user_detail.name,
                role: user_detail.role,
                password: ''
            };
        });
    }
 
    $scope.ok = function(){
        Users.edit($scope.user_detail);
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('main.users_list');
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
              historyRoot: true
        }); 
        $state.go('main.users_list');
    }; 

}])
