angular.module('starter.controllers')
.controller('LoginController', ["$rootScope", "$scope", "$state", "$ionicPopup", "$cordovaNetwork", "$cordovaDatePicker", "User", function($rootScope, $scope, $state, $ionicPopup, $cordovaNetwork, $cordovaDatePicker, User) {
    console.log("LoginController started");
    $scope.showLoginView = true;

    $scope.user = {
        email: '',
        password: '',
        new_password: '',
        new_password_again: ''
    };

    $scope.login = function (){ 
        User.login($scope.user.email, $scope.user.password, function(res){   
            if (res.uid) {
                if(res.password.isTemporaryPassword){
                    console.log("Temporary Password");
                    $scope.showLoginView = false;
                    $scope.showPasswordChangeView = true;
                }else{
                    $state.go('main.sales_list');
                }
            } else {
                $ionicPopup.alert({
                    title: 'Login error!',
                    template: res.message
                }); 
            }   
        }); 
    };  

    $scope.change_pw = function(){
        if($scope.user.new_password == $scope.user.new_password_again){
            User.change_pw($scope.user.email, $scope.user.password, $scope.user.new_password);
            $state.go('main.sales_list');
        }else{
            $scope.showPasswordNoMatchError = true;
        }
    };

}])
