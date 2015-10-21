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
.factory(serviceId, ['$http', loggingService]);

function loggingService($http) {
  var fLogs = new Firebase("https://fiery-heat-6039.firebaseio.com/logs/");

  var service = {
    pushData: pushData,
    log2FB: log2FB
  };
  return service;

  function log2FB(email, message) {
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

  function pushData(data) {
    //fill in with post to api
    //will be async and can just die if error
    console.log('push data', data);
  }
}
