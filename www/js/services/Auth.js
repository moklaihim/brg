angular.module('starter.services')
.factory('Auth', ["$rootScope", "$timeout", "$firebaseAuth", "$firebaseObject", function($rootScope, $timeout, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase("https://fiery-heat-6039.firebaseIO.com/");
    var auth = $firebaseAuth(ref);
    var user = {}; 

    return {
        login: function(email, password, callback){
            console.log("login started");
            auth.$authWithPassword({
                email: email,
                password: password
            }).then(function(res) {
                console.log("login succeeded");
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
        },

        change_pw: function(email, old_password, new_password){
            auth.$changePassword({
                email: email,
                oldPassword: old_password,
                newPassword: new_password
            }).then(function(){
                console.log("Password changed successfully!");
            }).catch(function(error) {
                console.error("Error: ", error);
            });
        },

        register: function(email, password, callback) {
            auth.$createUser({email: email, password: password}).then(function(res) {
                user = res;
                if (callback) {
                    callback(res)
                }
            }, function(err) {
                callback(err);
            }); 
        },  

        getUser: function() {
            return user;
        },

        getAuth: function() {
            console.log("getAuth started");
            console.log(auth);
            return auth;
        },

        logout: function() {
            auth.$unauth();
            user = {}; 
        }   
    }
}]);
