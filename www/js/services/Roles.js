angular.module('starter.services')
.factory('Roles', ["$q", "$firebaseObject", function($q, $firebaseObject) {
    var roles = new Object();
    var roles_array = new Array();
    var is_online;

    function createSampleData(){
        roles['promoter'] = {id: 'promoter', name: 'Promoter',       allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: false, allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: true};
        roles['sales_rep'] = {id: 'sales_rep', name: 'Sales Rep',    allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
        roles['management'] = {id: 'management', name: 'Management', allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: false};
        roles['oc'] = {id: 'oc', name: 'OC',                         allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: false, allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
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
            var fb_roles = "https://fiery-heat-6039.firebaseio.com/roles";
            var fRoles = new Firebase(fb_roles);
            roles = $firebaseObject(fRoles);
            //createSampleData();
            return roles;
        },

        get_one: function(role_id){
            var role = new Object();
            if(is_online){
                var fb_role = "https://fiery-heat-6039.firebaseio.com/roles/" + role_id;
                var fRole = new Firebase(fb_role);

                fRole.on("value", function(snapshot) {
                    localStorage.setItem('brg_role_' + role_id, JSON.stringify(snapshot.val()));
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
