angular.module('starter.services')
.factory('User', ["$rootScope", "$timeout", "$firebaseAuth", "$firebaseObject", function($rootScope, $timeout, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase("https://fiery-heat-6039.firebaseIO.com/");
    var auth = $firebaseAuth(ref);
    var user = {}; 
    var is_online = false;
    var fUser;
    var user_detail;
    init();

    function init(){
        var deviceInformation = ionic.Platform.device();
        if(deviceInformation.platform == "Android" || deviceInformation.platform == "iOS"){
            ionic.Platform.ready(function(){
                var isOffline = $cordovaNetwork.isOffline();

                if(isOffline){
                    console.log("Roles detected Offline");
                    onOffline();
                }else{
                    console.log("Roles detected Online");
                    onOnline();
                }   
            }); 
        }else{
            onOnline();
            //createInitialData();
        }   
    }   

    function onOnline() {
        if(!is_online){
            is_online = true;

            var fb_users = "https://fiery-heat-6039.firebaseio.com/users";
            var fUsers = new Firebase(fb_users);

            fUsers.on("value", function(snapshot) {
                localStorage.setItem('brg_users', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            });

            users = $firebaseObject(fUsers);
        }
    }

    function onOffline(){
        is_online = false;
        users = JSON.parse(localStorage.getItem('brg_users'));
        $rootScope.$on('$cordovaNetwork:online', onOnline);
    }


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
            return users[user_id];
        },

        get_list: function(){
            return users;
        },

        getAuth: function() {
            console.log("getAuth started");
            console.log(auth);
            return auth;
        },

        on_timeout: function() {
            onOffline();
        },

        logout: function() {
            auth.$unauth();
            user = {}; 
        }   
    }
}]);
