angular.module('starter.services')
.factory('$ZBar', ['$q', function ($q) {

    return {
      scan: function (config) {
        var q = $q.defer();

        //cordova.plugins.barcodeScanner.scan(function (result) {
        cloudSky.zBar.scan(config, function (result){
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      }

    };
}]);
