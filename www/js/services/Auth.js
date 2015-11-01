angular.module('starter.services')
.factory('Auth', ["$rootScope", "$timeout", "$firebaseAuth", "$firebaseObject", function($rootScope, $timeout, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase("https://fiery-heat-6039.firebaseIO.com/");
    var auth = $firebaseAuth(ref);
    var user = {}; 

    return {
        login: function(email, password, callback){
            console.log("BRG Debug: login started");
            // Logging.log2FB($scope.user_detail.email, "starts login function in Auth.js service");
            auth.$authWithPassword({
                email: email,
                password: password
            }).then(function(res) {
                console.log("BRG Debug: login succeeded");
                user = res;
                console.log(user);
                if (callback) {
                    $timeout(function() {
                        callback(res);
                    });
                }
            }, function(err) {
                callback(err);
            });
            // Logging.log2FB($scope.user_detail.email, "ends login function in Auth.js service");
        },

        change_pw: function(email, old_password, new_password){
            // Logging.log2FB($scope.user_detail.email, "starts change_pw function in Auth.js service");

            auth.$changePassword({
                email: email,
                oldPassword: old_password,
                newPassword: new_password
            }).then(function(){
                console.log("Password changed successfully!");
            }).catch(function(error) {
                console.error("Error: ", error);
            });
            // Logging.log2FB($scope.user_detail.email, "ends change_pw function in Auth.js service");
        },

        reset_pw: function(email){
            // Logging.log2FB($scope.user_detail.email, "starts reset_pw function in Auth.js service");

            auth.$resetPassword({
                email: email
            });
            // Logging.log2FB($scope.user_detail.email, "ends reset_pw function in Auth.js service");
        },

        register: function(email, password, callback) {
            // Logging.log2FB($scope.user_detail.email, "starts register function in Auth.js service");

            auth.$createUser({email: email, password: password}).then(function(res) {
                user = res;
                if (callback) {
                    callback(res)
                }
            }, function(err) {
                if (callback) {
                    callback(err);
                }
            }); 
            // Logging.log2FB($scope.user_detail.email, "ends register function in Auth.js service");
        },  

        getUser: function() {
            // Logging.log2FB($scope.user_detail.email, "starts getUser function in Auth.js service");
            return user;
            // Logging.log2FB($scope.user_detail.email, "ends getUser function in Auth.js service");
        },

        getAuth: function() {
            // Logging.log2FB($scope.user_detail.email, "starts getAuth function in Auth.js service");
            return auth;
            // Logging.log2FB($scope.user_detail.email, "ends getAuth function in Auth.js service");
        },

        logout: function() {
            // Logging.log2FB($scope.user_detail.email, "starts logout function in Auth.js service");
            auth.$unauth();
            user = {}; 
            // Logging.log2FB($scope.user_detail.email, "ends logout function in Auth.js service");
        }   
    }
}]);
