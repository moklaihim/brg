angular.module('starter.controllers')
.controller('LoginController', ["$rootScope", "$scope", "$state", "$ionicPopup", "$cordovaNetwork", "$cordovaDatePicker", "User", function($rootScope, $scope, $state, $ionicPopup, $cordovaNetwork, $cordovaDatePicker, User) {
    console.log("LoginController started");

    $scope.user = {
        email: '',
        password: ''
    };

    $scope.login = function (){ 
        User.login($scope.user.email, $scope.user.password, function(res){   
            if (res.uid) {
                //$scope.user = res;
                $state.go('main.sales_list');
            } else {
                $ionicPopup.alert({
                    title: 'Login error!',
                    template: res.message
                }); 
            }   
        }); 
    };  

}])
