angular.module('starter.services')
.factory('Roles', ["$rootScope", "$cordovaNetwork", "$firebaseObject", "$firebaseArray", function($rootScope, $cordovaNetwork, $firebaseObject, $firebaseArray) {
    var roles;
    var roles_array;
    var is_online = false;
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

    function createInitialData(){
        console.log("Roles createInitialData started");
        var fb_roles = "https://fiery-heat-6039.firebaseio.com/roles";
        var fRoles = new Firebase(fb_roles);
        roles = $firebaseObject(fRoles);
        roles['promoter'] = {id: 'promoter', name: 'Promoter',       allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: false, allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: true};
        roles['sales_rep'] = {id: 'sales_rep', name: 'Sales Rep',    allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
        roles['management'] = {id: 'management', name: 'Management', allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: true,  allowEditAllSales: false, allowEditOwnSales: true, allowDeleteAllSales: false, allowDeleteOwnSales: true, allowCloseSales: false};
        roles['oc'] = {id: 'oc', name: 'OC',                         allowAccessUsersMenu: false, allowAccessRolesMenu: false, allowViewAllSales: true,  allowAddSales: false, allowEditAllSales: true,  allowEditOwnSales: true, allowDeleteAllSales: true,  allowDeleteOwnSales: true, allowCloseSales: true};
        roles.$save();
    };

    function onOnline() {
        if(!is_online){
            is_online = true;

            var fb_roles = "https://fiery-heat-6039.firebaseio.com/roles";
            var fRoles = new Firebase(fb_roles);

            fRoles.on("value", function(snapshot) {
                localStorage.setItem('brg_roles', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
            });

            roles = $firebaseObject(fRoles);
            roles_array = $firebaseArray(fRoles);
        }
    }

    function onOffline(){
        is_online = false;
        roles = JSON.parse(localStorage.getItem('brg_roles'));
        roles_array = Object.keys(roles).map(function(key) { return roles[key] });
        $rootScope.$on('$cordovaNetwork:online', onOnline);
    }

    return {
        get_list: function(){
            return roles;
        },
        get_list_as_array: function(){
            return roles_array;
        },
        reload_list: function(){
            is_online = false;
            init();
            return roles;
        },
        on_timeout: function(){
            onOffline();
        },
        get_one: function(role){
            return roles[role];
        }
    }
}]);
