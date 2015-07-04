angular.module('starter.controllers')
.controller('LoginController', ["$scope", "$state", "$ionicPopup", "$ionicHistory", "Auth", function($scope, $state, $ionicPopup, $ionicHistory, Auth) {
    console.log("LoginController started");

    $scope.user = {
        email: '',
        password: '',
        new_password: '',
        new_password_again: ''
    };

    $ionicHistory.nextViewOptions({
        historyRoot: true
    });

    if(window.localStorage.getItem('brg_login_email') !== null){
        $scope.user.email = window.localStorage.getItem('brg_login_email');
        $scope.user.password = window.localStorage.getItem('brg_login_password');
        Auth.login($scope.user.email, $scope.user.password, function(res){   
            if (res.uid) {
                if(res.password.isTemporaryPassword){
                    console.log("Temporary Password");
                    $scope.showLoginView = false;
                    $scope.showPasswordChangeView = true;
                }else{
                    $state.go('main.sales_list');
                }
            } else {
                $scope.user.email = '';
                $scope.user.password = '';
                $scope.showLoginView = true;
                $ionicPopup.alert({
                    title: 'Login error!',
                    template: res.message,
                    okType: 'button-flat'
                }); 
            }   
        }); 
    }else{
        $scope.showLoginView = true;
    }

    $scope.login = function (){ 
        $scope.showLoginView = false;
        Auth.login($scope.user.email, $scope.user.password, function(res){
            if (res.uid) {
                if(res.password.isTemporaryPassword){
                    console.log("Temporary Password");
                    $scope.showPasswordChangeView = true;
                }else{
                    window.localStorage.setItem("brg_login_email", $scope.user.email);
                    window.localStorage.setItem("brg_login_password", $scope.user.password);
                    $state.go('main.sales_list');
                }
            } else {
                $scope.showLoginView = true;
                $ionicPopup.alert({
                    title: 'Login error!',
                    template: res.message,
                    okType: 'button-flat'
                }); 
            }   
        }); 
    };  

    $scope.change_pw = function(){
        if($scope.user.new_password == $scope.user.new_password_again){
            Auth.change_pw($scope.user.email, $scope.user.password, $scope.user.new_password);
            window.localStorage.setItem("brg_login_email", $scope.user.email);
            window.localStorage.setItem("brg_login_password", $scope.user.new_password);
            $state.go('main.sales_list');
        }else{
            $scope.showPasswordNoMatchError = true;
        }
    };

}])
