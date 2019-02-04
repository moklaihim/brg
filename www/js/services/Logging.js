/*angular.module('starter.services')
.factory('GA', ["$cordovaGoogleAnalytics", function($cordovaGoogleAnalytics) {
    console.log("GA started");

    return {
        logError: function(message){
            $cordovaGoogleAnalytics.trackEvent('error handler', message);
            return;
        }
    }
}]);
*/

var serviceId = 'loggingService';
angular.module('starter.services')
.factory(serviceId, ['$http', 'Env', loggingService]);

function loggingService($http, Env) {
  // Mok Firebase SDK upgrade
  var config = {
    apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
    authDomain: "fiery-heat-6039.firebaseapp.com",
    databaseURL: "https://fiery-heat-6039.firebaseio.com"
  };

  var fLogs = null;
  if (firebase.apps.length){
      fLogs = firebase.database().ref("logs/");
  } else {
      firebase.initializeApp(config);
      fLogs = firebase.database().ref("logs/");
  }    
  // Mok Firebase SDK upgrade

  var service = {
    log2FB: log2FB
  };
  return service;

  function log2FB(email, message) {
    if(Env.isOnline()){
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

      var fUserLog = fLogs.child(user_id + "/" + update_year + "/" + update_month + "/" + update_day + "/error/" + current_ut);
      fUserLog.set({
        message: message
      });
    }
  }
}
