angular.module('starter.controllers')
.controller('LoginController', ["$scope", "$state", "$ionicPopup", "$ionicHistory", "Auth", "Env", "Logging", function($scope, $state, $ionicPopup, $ionicHistory, Auth, Env, Logging) {
    console.log("BRG Debug: LoginController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('LoginController');
    //}
    // Logging.log2FB("unknown", "LoginController started");// not required as no permission to save in firebase if not login

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
            console.log("BRG Debug: Auth login returned");
            if (res.uid) {
                console.log("BRG Debug: res.uid exist");
                if(res.password.isTemporaryPassword){
                    console.log("Temporary Password");
                    $scope.showLoginView = false;
                    $scope.showPasswordChangeView = true;
                }else{
                    console.log("BRG Debug: forwarding");
                    $state.go('main.sales_list');
                }
            } else {
                console.log("BRG Debug: res.uid not exist");
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
        var real_email;
        $scope.showLoginView = false;

        if(!/@/.test($scope.user.email)){
            console.log("email doesnt have domain part");
            real_email = $scope.user.email + "@brg.com.sg";
        }else{
            real_email = $scope.user.email;
        }

        Auth.login(real_email, $scope.user.password, function(res){
            if (res.uid) {
                if(res.password.isTemporaryPassword){
                    console.log("Temporary Password");
                    $scope.showPasswordChangeView = true;
                }else{
                    window.localStorage.setItem("brg_login_email", real_email);
                    window.localStorage.setItem("brg_login_password", $scope.user.password);
                    console.log("BRG Debug: Sending to sales list");
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
