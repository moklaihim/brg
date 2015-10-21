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
  var service = {
    pushData: pushData,
    logError: logError
  };
  return service;

  function logError(errorData, message) {
    if(window.cordova){
      //$cordovaGoogleAnalytics.trackEvent('error handler',message);
    } else {
      if(console){console.log('error handler: ',message);}
    }
  }

  function pushData(data) {
    //fill in with post to api
    //will be async and can just die if error
    console.log('push data', data);
  }
}
