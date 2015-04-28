angular.module('starter.services')
.factory('Sales', ["$timeout", "$firebaseArray", function($timeout, $firebaseArray) {

    var sales = [];

    return {
        get: function(store_id, year, month, day){
            var fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day);
            fSales.on('value', function(snapshot) {
                //console.log(snapshot.val());
            }, undefined, undefined, true);
            sales = $firebaseArray(fSales);
            return sales;
        }
    }
}]);
