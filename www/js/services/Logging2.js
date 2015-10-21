angular.module('starter.services')
.factory('Logging', ["Auth", function(Auth) {
    console.log("GA started");
    var fLogs = new Firebase("https://fiery-heat-6039.firebaseio.com/logs/");

    return {
        log2FB: function(email, message){
          var user_id = email.replace("@", "_").replace(/\./g, "_");
          var now = new Date();
          var hour = now.getHours();
          var minute = now.getMinutes();
          if (minute < 10) { minute = '0' + minute; }
          var time = hour + ':' + minute;
          var current_ut = now.getTime();
          var update_year = now.getFullYear();
          var update_month = now.getMonth()+1;
          if (update_month < 10) { update_month = '0' + update_month; }
          var update_day = now.getDate();
          if (update_day < 10) { update_day = '0' + update_day; }

          var fUserLog = fLogs.child(user_id + "/" + update_year + "/" + update_month + "/" + update_day + "/" + current_ut);
          fUserLog.set({
            message: message
          });
        }
    }
}]);
