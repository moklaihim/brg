angular.module('starter.services')
.factory('Users', ["$state", "$q", "$firebaseObject", "Auth", function($state, $q, $firebaseObject, Auth) {
    var users = new Object(); 
    var user = new Object();
    var is_online;

    function createSamplelData(){
        users['tom_tomonari_gmail_com'] = {id: 'tom_tomonari_gmail_com', email: 'tom.tomonari@gmail.com', name: 'Tom Tomonari', role: 'promoter'};
        users['ericong_kc_gmail_com'] = {id: 'ericong_kc_gmail_com', email: 'ericong.kc@gmail.com', name: 'Eric Ong', role: 'sales_rep'};
        users.$save();
    }

    function convertEmail2Id(email){
        return email.toLowerCase().replace("@", "_").replace(/\./g, "_");
    }

    return {
        online: function(){
            is_online = true;
        },

        offline: function(){
            is_online = false;
        },

        convert_email_2_id: function(email){
            return convertEmail2Id(email);
        },

        get_list: function(){
            var fb_users = "https://fiery-heat-6039.firebaseio.com/users";
            var fUsers = new Firebase(fb_users);
            users = $firebaseObject(fUsers);
            //createSampleData();
            return users;
        },

        get_one: function(ref, type){
            console.log("BRG Debug: Users.get_one started");
            var user_id;
            var email;

            if(type == "email"){
                email = ref;
                user_id = convertEmail2Id(ref);
            }else{
                email = "";
                user_id = ref;
            }

            if(is_online){
                console.log("BRG Debug: ");
                console.log("BRG Debug: System online");
                var fb_user = "https://fiery-heat-6039.firebaseio.com/users/" + user_id;
                var fUser = new Firebase(fb_user);

                fUser.on("value", function(snapshot) {
                    localStorage.setItem('brg_user_' + user_id, JSON.stringify(snapshot.val()));
                }, function (errorObject) {
                    console.log("BRG Debug: The read failed: " + errorObject.code);
                    if(errorObject.code === "PERMISSION_DENIED"){
                      $state.go('login');
                    }
                });

                user = $firebaseObject(fUser).$loaded();
            }else{
                console.log("BRG Debug: System offline");
                if(localStorage.getItem('brg_user_' + user_id) !== null){
                    console.log("BRG Debug: brg_user exist");
                    user = JSON.parse(localStorage.getItem('brg_user_' + user_id));
                }else{
                    console.log("BRG Debug: brg_user not exist");
                    user.active = true;
                    user.email = email;
                }
            }
            console.log("BRG Debug: Users.get_one finished");
            return $q.when(user);
        },

        logout: function(email){
            var user_id = convertEmail2Id(email);
            if(localStorage.getItem('brg_user_' + user_id) !== null){
                localStorage.removeItem('brg_user_' + user_id);
            }
        },

        edit: function(user_detail){
            var now = new Date();
            var current_ut = now.getTime();
            user_detail.email = user_detail.email.toLowerCase();
            var user_id;
            if(is_online){
                if(user_detail.id){
                    user_id = user_detail.id;
                }else{
                    user_id = convertEmail2Id(user_detail.email);
                    Auth.register(user_detail.email, user_detail.password);
                }

                var fb_user = "https://fiery-heat-6039.firebaseio.com/users/" + user_id;
                var fUser = new Firebase(fb_user);
                fUser.set({
                    id: user_id,
                    active: true,
                    email: user_detail.email,
                    name: user_detail.name,
                    role: user_detail.role,
                    storeIC: user_detail.storeIC,
                    reportTo: user_detail.reportTo || "",
                    reportCc: user_detail.reportCc || ""
                });
            }
        },

        is_exist: function(email){
          var user_id = convertEmail2Id(email);
          if(user_id in users){
            return true;
          }else{
            return false;
          }
        },

        deactivate: function(user_id){
            if(is_online){
                users[user_id].active = false;
                users.$save();
            }
        },

        reset_pw: function(email){
            if(is_online){
                Auth.reset_pw(email);
            }
        }
    }
}]);
