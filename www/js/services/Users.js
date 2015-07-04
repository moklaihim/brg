angular.module('starter.services')
.factory('Users', ["$q", "$firebaseObject", "Auth", function($q, $firebaseObject, Auth) {
    var users = new Object(); 
    var user = new Object();
    var is_online;

    function createSamplelData(){
        users['tom_tomonari_gmail_com'] = {id: 'tom_tomonari_gmail_com', email: 'tom.tomonari@gmail.com', name: 'Tom Tomonari', role: 'promoter'};
        users['ericong_kc_gmail_com'] = {id: 'ericong_kc_gmail_com', email: 'ericong.kc@gmail.com', name: 'Eric Ong', role: 'sales_rep'};
        users.$save();
    }

    return {
        online: function(){
            is_online = true;
        },

        offline: function(){
            is_online = false;
        },

        get_list: function(){
            var fb_users = "https://fiery-heat-6039.firebaseio.com/users";
            var fUsers = new Firebase(fb_users);
            users = $firebaseObject(fUsers);
            //createSampleData();
            return users;
        },

        get_one: function(ref, type){
            var user_id;

            if(type == "email"){
                user_id = ref.replace("@", "_").replace(/\./g, "_");
            }else{
                user_id = ref;
            }

            if(is_online){
                var fb_user = "https://fiery-heat-6039.firebaseio.com/users/" + user_id;
                var fUser = new Firebase(fb_user);

                fUser.on("value", function(snapshot) {
                    localStorage.setItem('brg_user_' + user_id, JSON.stringify(snapshot.val()));
                });

                user = $firebaseObject(fUser).$loaded();
            }else{
                if(localStorage.getItem('brg_user_' + user_id) !== null){
                    user = JSON.parse(localStorage.getItem('brg_user_' + user_id));
                }else{
                    user.active = true;
                    user.email = email;
                }
            }
            return $q.when(user);
        },

        logout: function(email){
            var user_id = email.replace("@", "_").replace(/\./g, "_");
            if(localStorage.getItem('brg_user_' + user_id) !== null){
                localStorage.removeItem('brg_user_' + user_id);
            }
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
                    Auth.register(user_detail.email, user_detail.password);
                }

                users[user_id] = new Object();
                users[user_id].id = user_id;
                users[user_id].active = true;
                users[user_id].email = user_detail.email;
                users[user_id].name = user_detail.name;
                users[user_id].role = user_detail.role;
                users.$save();
            }
        },

        remove: function(user_id){
            if(is_online){
                users[user_id].active = false;
                users.$save();
            }
        }
    }
}]);
