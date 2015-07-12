angular.module('starter.controllers')
.controller('UserEditController', ["$scope", "$ionicHistory", "$state", "$ionicPopup", "Roles", "Users", function($scope, $ionicHistory, $state, $ionicPopup, Roles, Users) {

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

    $scope.reset_pw = function(){
        Users.reset_pw($scope.user_detail.email);
        $scope.showAlert("Password reset email will be sent to the user shortly");
    };
 
    $scope.ok = function(){
        confirmedAlert();
        Users.edit($scope.user_detail);
        $state.go('main.users_list');
        // $ionicHistory.nextViewOptions({
        //     historyRoot: true
        // });
    };

    $scope.cancel = function(){
        $ionicHistory.nextViewOptions({
              historyRoot: true
        }); 
        $state.go('main.users_list');
    }; 

    function logout(){
        console.log("logout started");
        window.localStorage.removeItem("brg_login_email");
        window.localStorage.removeItem("brg_login_password");
        Users.logout(currentAuth.password.email);
        Auth.logout();
        $state.go('login');
    }
    $scope.logout = logout;

    function confirmedAlert(){
        // var msg = item_id;
        var alertPopup = $ionicPopup.alert({
         title: 'User :' + $scope.user_detail.name,
         template: 'Updated',
         okType: 'button-flat'
        });
    };
    $scope.confirmedAlert = confirmedAlert;

    // function confirmedAlert(){
    //    var confirmPopup = $ionicPopup.confirm({
    //      title: 'Confirm?',
    //      template: 'Click OK to confirm changes, You will be prompt to login again',
    //      okType: 'button-flat',
    //      cancelType: 'button-flat'
    //    });
    //     confirmPopup.then(function(res) {
    //         if(res) {
    //             console.log('You are sure');
    //             Users.edit($scope.user_detail);
    //             logout();
    //         } if(!res) {
    //             console.log('You are not sure');
    //         }
    //     });
    // };
    // $scope.confirmedAlert = confirmedAlert;


}])
