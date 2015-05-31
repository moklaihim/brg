angular.module('starter.services')
.factory('Users', ["$firebaseObject", "Auth", function($firebaseObject, Auth) {
    var users = {}; 
    var is_online;

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
        online: function(){
            var fb_users = "https://fiery-heat-6039.firebaseio.com/users";
            var fUsers = new Firebase(fb_users);

            fUsers.on("value", function(snapshot) {
                localStorage.setItem('brg_users', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            });

            users = $firebaseObject(fUsers);
            is_online = true;
        },

        offline: function(){
            users = JSON.parse(localStorage.getItem('brg_users'));
            is_online = false;
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

        edit: function(user_detail){
            var now = new Date();
            var current_ut = now.getTime();
            var user_id;

            if(is_online){
                if(user_detail.id){
                    user_id = user_detail.id;
                }else{
                    user_id = user_detail.email.replace("@", "_").replace(/\./g, "_");
                }

                Auth.register(user_detail.email, user_detail.password);
                users[user_id] = new Object();
                users[user_id].id = user_id;
                users[user_id].email = user_detail.email;
                users[user_id].name = user_detail.name;
                users[user_id].role = user_detail.role;
                users.$save();
            }
        },

        remove: function(user_id){
            if(is_online){
                users[user_id] = new Object();
                users.$save();
            }
        }
    }
}]);
