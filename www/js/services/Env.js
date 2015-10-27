angular.module('starter.services')
.factory('Env', ["Users", "Stores", "Items", "Roles", "Sales", "Codes", function(Users, Stores, Items, Roles, Sales, Codes) {
    console.log("Env started");

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
              console.log("BRG Debug: connection status changed");
            if (snap.val() === true) {
              console.log("BRG Debug: Connected");
              isOnline = true;
              isConnected = true;
              console.log("Users online start");
              Users.online();
              console.log("Items online start");
              Items.online();
              console.log("Stores online start");
              Stores.online();
              console.log("Roles online start");
              Roles.online();
              console.log("Sales online start");
              Sales.online();
              console.log("Codes online start");
              Codes.online();
              console.log("All online done");
            } else {
              console.log("BRG Debug: Disconnected");
              isOnline = false;
              console.log("Users offline start");
              Users.offline();
              console.log("Items offline start");
              Items.offline();
              console.log("Stores offline start");
              Stores.offline();
              console.log("Roles offline start");
              Roles.offline();
              console.log("Sales offline start");
              Sales.offline();
              console.log("Codes offline start");
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
