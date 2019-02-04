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
          // Logging.log2FB($scope.user_detail.email, "starts conMon function in Env.js service");          
        // Mok Firebase SDK upgrade
        var config = {
            apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
            authDomain: "fiery-heat-6039.firebaseapp.com",
            databaseURL: "https://fiery-heat-6039.firebaseio.com"
        };

        var connectedRef = null;
        if (firebase.apps.length){
            connectedRef = firebase.database().ref(".info/connected");
        } else {
            firebase.initializeApp(config);
            connectedRef = firebase.database().ref(".info/connected");
        }    
        // Mok Firebase SDK upgrade
        console.log("connectedRef: ", connectedRef, firebase.apps.length);
          connectedRef.on("value", function(snap) {
              // Logging.log2FB($scope.user_detail.email, "BRG Debug: connection status changed in Env.js service");
              // console.log("BRG Debug: connection status changed");
            if (snap.val() === true) {
              // Logging.log2FB($scope.user_detail.email, "BRG Debug: Connected in Env.js service");
              // console.log("BRG Debug: Connected");
              isOnline = true;
              isConnected = true;
              // Logging.log2FB($scope.user_detail.email, "Users online start in Env.js service");
              // console.log("Users online start");
              Users.online();
              // Logging.log2FB($scope.user_detail.email, "Items online start in Env.js service");
              // console.log("Items online start");
              Items.online();
              // Logging.log2FB($scope.user_detail.email, "Stores online start in Env.js service");
              // console.log("Stores online start");
              Stores.online();
              // Logging.log2FB($scope.user_detail.email, "Roles online start in Env.js service");
              // console.log("Roles online start");
              Roles.online();
              // Logging.log2FB($scope.user_detail.email, "Sales online start in Env.js service");
              // console.log("Sales online start");
              Sales.online();
              // Logging.log2FB($scope.user_detail.email, "Codes online start in Env.js service");
              // console.log("Codes online start");
              Codes.online();
              // Logging.log2FB($scope.user_detail.email, "All online done in Env.js service");
              // console.log("All online done");
            } else {
              // Logging.log2FB($scope.user_detail.email, "BRG Debug: Disconnected in Env.js service");
              // console.log("BRG Debug: Disconnected");
              isOnline = false;
              // Logging.log2FB($scope.user_detail.email, "Users offline start in Env.js service");
              // console.log("Users offline start");
              Users.offline();
              // Logging.log2FB($scope.user_detail.email, "Items offline start in Env.js service");
              // console.log("Items offline start");
              Items.offline();
              // Logging.log2FB($scope.user_detail.email, "Stores offline start in Env.js service");
              // console.log("Stores offline start");
              Stores.offline();
              // Logging.log2FB($scope.user_detail.email, "Roles offline start in Env.js service");
              // console.log("Roles offline start");
              Roles.offline();
              // Logging.log2FB($scope.user_detail.email, "Sales offline start in Env.js service");
              // console.log("Sales offline start");
              Sales.offline();
              // Logging.log2FB($scope.user_detail.email, "Codes offline start in Env.js service");
              // console.log("Codes offline start");
              Codes.offline();
            }
          });
        // Logging.log2FB($scope.user_detail.email, "ends conMon function in Env.js service");
        },

        isMobile: function(){
            // Logging.log2FB($scope.user_detail.email, "starts isMobile function in Env.js service");
            return isMobile;
        },
        isOnline: function(){
            //console.log("isOnline: ", isOnline);
            // Logging.log2FB($scope.user_detail.email, "starts isOnline function in Env.js service");
            return isOnline;
        },
        isConnected: function(){
            // Logging.log2FB($scope.user_detail.email, "starts isConnected function in Env.js service");
            return isConnected;
        }
    }
}]);
