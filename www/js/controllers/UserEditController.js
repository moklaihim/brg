angular.module('starter.controllers')
.controller('UserEditController', ["$scope", "$ionicHistory", "$state", "Roles", "Users", function($scope, $ionicHistory, $state, Roles, Users) {

    $scope.roles = Roles.get_list();

    if ($state.current.name === "main.users_add"){
        $scope.user_detail = {
            email: '',
            id: '',
            name: '',
            role: '',
            password: ''
        }
    }else{
        var $users = Users.get_list();
        if($users.$loaded){
            $users.$loaded().then(function(){
                var $user = $users[$scope.current.user_id];
                $scope.user_detail = {
                    email: $user.email,
                    id: $user.id,
                    name: $user.name,
                    role: $user.role,
                    password: ''
                }
            });
        }else{
            var $user = $users[$scope.current.user_id];
            $scope.user_detail = {
                email: $user.email,
                id: $user.id,
                name: $user.name,
                role: $user.role,
                password: ''
            }
        }
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
