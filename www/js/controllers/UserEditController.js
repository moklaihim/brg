angular.module('starter.controllers')
.controller('UserEditController', ["$scope", "$ionicHistory", "$state", "$ionicPopup", "Roles", "Stores", "Users", "Env", "Logging", function($scope, $ionicHistory, $state, $ionicPopup, Roles, Stores, Users, Env, Logging) {
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('UserEditController');
    //}
    Logging.log2FB($scope.user_detail.email, "UserEditController started");

    $scope.roles = Roles.get_list();
    $scope.stores = Stores.get_list();

    if ($state.current.name === "main.users_add"){
        // Adding new user
        Logging.log2FB($scope.user_detail.email, "Add new user button pressed in UserEditController");
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
        Logging.log2FB($scope.user_detail.email, "Edit user pressed in UserEditController");
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
        Logging.log2FB($scope.user_detail.email, "starts reset_pw function in UserEditController");
        Users.reset_pw($scope.user_detail.email);
        $scope.showAlert("Notice", "Password reset email will be sent to the user shortly");
        Logging.log2FB($scope.user_detail.email, "ends reset_pw function in UserEditController");
    };
 
    $scope.ok = function(){
        Logging.log2FB($scope.user_detail.email, "starts ok function in UserEditController");
        if(!$scope.user_detail.storeIC){
            $scope.user_detail.storeIC = "";
        }
        if(Users.is_exist($scope.user_detail.email)){
          $scope.showAlert("Notice", "User: " + $scope.user_detail.email + " is re-activated. New password will be sent to the email address.");
          $scope.user_detail.id = Users.convert_email_2_id($scope.user_detail.email);
          Users.edit($scope.user_detail);
          Users.reset_pw($scope.user_detail.email);
        }else{
          $scope.showAlert("Notice", "User: " + $scope.user_detail.email + " Updated");
          Users.edit($scope.user_detail);
        }
        $state.go('main.users_list');
        Logging.log2FB($scope.user_detail.email, "ends ok function in UserEditController");
    };

    $scope.cancel = function(){
        Logging.log2FB($scope.user_detail.email, "starts cancel function in UserEditController");
        $ionicHistory.nextViewOptions({
              historyRoot: true
        }); 
        $state.go('main.users_list');
        Logging.log2FB($scope.user_detail.email, "starts cancel function in UserEditController");
    }; 
}])
