angular.module('starter.services')
.factory('Roles', ["$q", "$firebaseObject", "$state", function($q, $firebaseObject, $state) {
    var roles = new Object();
    var roles_array = new Array();
    var is_online;

    function createSampleData(){
        roles['promoter'] = {id: 'promoter', name: 'Promoter',       allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: false, allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: true};
        roles['sales_rep'] = {id: 'sales_rep', name: 'Sales Rep',    allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
        roles['management'] = {id: 'management', name: 'Management', allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: false};
        roles['office_admin'] = {id: 'office_admin', name: 'Office Admin',                         allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: false, allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
        roles.$save();
    };

    return {
        online: function(){
            is_online = true;
        },

        offline: function(){
            is_online = false;
        },

        get_list: function(){
            //var fb_roles = "https://fiery-heat-6039.firebaseio.com/roles";
            // Mok Firebase SDK upgrade
            var config = {
                apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                authDomain: "fiery-heat-6039.firebaseapp.com",
                databaseURL: "https://fiery-heat-6039.firebaseio.com"
            };

            var fRoles = null;
            if (firebase.apps.length){
                fRoles = firebase.database().ref("roles");
            } else {
                firebase.initializeApp(config);
                fRoles = firebase.database().ref("roles");
            }    
            // Mok Firebase SDK upgrade   
            roles = $firebaseObject(fRoles);
            //createSampleData();
            return roles;
        },

        get_one: function(role_id){
            var role = new Object();
            if(is_online){
                //var fb_role = "https://fiery-heat-6039.firebaseio.com/roles/" + role_id;                
                // Mok Firebase SDK upgrade
                var config = {
                    apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                    authDomain: "fiery-heat-6039.firebaseapp.com",
                    databaseURL: "https://fiery-heat-6039.firebaseio.com"
                };

                var fRole = null;
                if (firebase.apps.length){
                    fRole = firebase.database().ref("roles/" + role_id);
                } else {
                    firebase.initializeApp(config);
                    fRole = firebase.database().ref("roles/" + role_id);
                }    
                // Mok Firebase SDK upgrade   

                fRole.on("value", function(snapshot) {
                    localStorage.setItem('brg_role_' + role_id, JSON.stringify(snapshot.val()));
                }, function (errorObject) {
                  console.log("BRG Debug: The read failed: " + errorObject.code);
                  if(errorObject.code === "PERMISSION_DENIED"){
                    $state.go('login');
                  }
                });

                role = $firebaseObject(fRole).$loaded();
            }else{
                if(localStorage.getItem('brg_role_' + role_id) !== null){
                    role = JSON.parse(localStorage.getItem('brg_role_' + role_id));
                }else{
                    role = {id: 'temp', name: 'Temp', allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: false, allowAddSales: false,  allowEditAllSales: false, allowEditOwnSales: false, allowDeleteAllSales: false, allowDeleteOwnSales: false, allowCloseSales: false};
                }
            }
            return $q.when(role);
        }
    }
}]);
