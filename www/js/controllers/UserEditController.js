angular.module('starter.controllers')
.controller('UserEditController', ["$scope", "$ionicHistory", "$state", "$ionicPopup", "Roles", "Stores", "Users", function($scope, $ionicHistory, $state, $ionicPopup, Roles, Stores, Users) {

    $scope.roles = Roles.get_list();
    $scope.stores = Stores.get_list();

    if ($state.current.name === "main.users_add"){
        // Adding new user
        $scope.user_detail = {
            email: '',
            id: '',
            name: '',
            role: '',
            sendTo:'',
            sendCc:'',
            storeIC:'',
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
                storeIC: user_detail.storeIC,
                sendTo: user_detail.reportSendTo,
                sendCc: user_detail.reportSendCc,
                password: ''
            };
        });
    }

    $scope.reset_pw = function(){
        Users.reset_pw($scope.user_detail.email);
        $scope.showAlert("Password reset email will be sent to the user shortly");
    };
 
    $scope.ok = function(){
        showAlert("User: " + $scope.user_detail.name + " Updated");
        Users.edit($scope.user_detail);
        $state.go('main.users_list');
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
              historyRoot: true
        }); 
        $state.go('main.users_list');
    }; 
}])
