angular.module('starter.services')
.factory('User', ["$timeout", "$firebaseAuth", "$firebaseObject", function($timeout, $firebaseAuth, $firebaseObject) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var ref = new Firebase("https://fiery-heat-6039.firebaseIO.com/");
    var auth = $firebaseAuth(ref);
    var user = {}; 
    var is_online = true;
    var fUser;
    var user_detail;
    //createInitialData();

    function createInitialData(){
        console.log("createInitialData started");
        var fb_users = "https://fiery-heat-6039.firebaseio.com/users";
        var fUsers = new Firebase(fb_users);
        users = $firebaseObject(fUsers);
        users['tom_tomonari_gmail_com'] = {id: 'tom_tomonari_gmail_com', email: 'tom.tomonari@gmail.com', name: 'Tom Tomonari', role: 'promoter'};
        users['ericong_kc_gmail_com'] = {id: 'ericong_kc_gmail_com', email: 'ericong.kc@gmail.com', name: 'Eric Ong', role: 'sales_rep'};
        users.$save();
    }

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

        getUserDetail: function(email){
            console.log("getUserDetail started");
            var user_id = email.replace("@", "_").replace(/\./g, "_");
            console.log(user_id);
            if(is_online){
                fUser = new Firebase("https://fiery-heat-6039.firebaseio.com/users/" + user_id);
                user_detail = $firebaseObject(fUser);
            }else{
                if (localStorage.getItem('brg_users-' + user_id) !== null) {
                    user_detail = JSON.parse(localStorage.getItem('brg_users-' + user_id));
                }else{
                    user_detail = new Object();
                }   
            }   
            return user_detail;
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
