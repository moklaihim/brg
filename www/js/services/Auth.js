angular.module('starter.services')
.factory('Auth', ["$rootScope", "$timeout", "$firebaseAuth", "$firebaseObject", function($rootScope, $timeout, $firebaseAuth, $firebaseObject) {

    // Mok Firebase SDK upgrade
    var config = {
        apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
        authDomain: "fiery-heat-6039.firebaseapp.com",
        databaseURL: "https://fiery-heat-6039.firebaseio.com"
    };

    var ref = null;
    if (firebase.apps.length){
        ref = firebase.database().ref();
    } else {
        firebase.initializeApp(config);
        ref = firebase.database().ref();
    }    
    // Mok Firebase SDK upgrade

    var auth = $firebaseAuth();
    console.log("auth:", auth);
    var user = {}; 

    return {
        login: function(email, password, callback){
            console.log("BRG Debug: login started");
            console.log(email, password)
            // Logging.log2FB($scope.user_detail.email, "starts login function in Auth.js service");
            //firebase.auth().signInWithEmailAndPassword(email, password)
            auth.$signInWithEmailAndPassword(email, password)
                .then(res => {
                    console.log("BRG Debug: login succeeded");
                    user = res;
                    console.log(user);
                    if (callback) {
                        $timeout(function() {
                            callback(res);
                        });
                    }
                })
                .catch(err => callback(err));
            // Logging.log2FB($scope.user_detail.email, "ends login function in Auth.js service");
        },

        change_pw: function(email, old_password, new_password){
            // Logging.log2FB($scope.user_detail.email, "starts change_pw function in Auth.js service");

            auth.$updatePassword(new_password).then(function(){
                console.log("Password changed successfully!");
            }).catch(function(error) {
                console.error("Error: ", error);
            });
            // Logging.log2FB($scope.user_detail.email, "ends change_pw function in Auth.js service");
        },

        reset_pw: function(email){
            // Logging.log2FB($scope.user_detail.email, "starts reset_pw function in Auth.js service");

            auth.$sendPasswordResetEmail(email);
            // Logging.log2FB($scope.user_detail.email, "ends reset_pw function in Auth.js service");
        },

        register: function(email, password, callback) {
            // Logging.log2FB($scope.user_detail.email, "starts register function in Auth.js service");

            auth.$createUserWithEmailAndPassword(email, password).then(function(res) {
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
            auth.$signOut();
            user = {}; 
            // Logging.log2FB($scope.user_detail.email, "ends logout function in Auth.js service");
        }   
    }
}]);
