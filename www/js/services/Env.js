angular.module('starter.services')
.factory('Env', ["Users", "Stores", "Items", "Roles", "Sales", "Codes", function(Users, Stores, Items, Roles, Sales, Codes) {

    var isMobile;
    var isOnline;
    var isConnected = false;
    //localStorage.clear();

    if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
        isMobile = true;
    }else{
        isMobile = false;
    }

    return {
        conMon: function(){
            var connectedRef = new Firebase("https://fiery-heat-6039.firebaseIO.com/.info/connected");
            connectedRef.on("value", function(snap) {
                if (snap.val() === true) {
                    console.log("BRG Debug: Connected");
                    isOnline = true;
                    isConnected = true;
                    Users.online();
                    Items.online();
                    Stores.online();
                    Roles.online();
                    Sales.online();
                    Codes.online();
                } else {
                    console.log("BRG Debug: Disconnected");
                    isOnline = false;
                    Users.offline();
                    Items.offline();
                    Stores.offline();
                    Roles.offline();
                    Sales.offline();
                    Codes.offline();
                }
            });
        },
        isMobile: function(){
            return isMobile;
        },
        isOnline: function(){
            return isOnline;
        },
        isConnected: function(){
            return isConnected;
        }
    }
}]);
