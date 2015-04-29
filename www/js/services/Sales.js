angular.module('starter.services')
.factory('Sales', ["$timeout", "$firebaseArray", function($timeout, $firebaseArray) {
    sales = {};
    fSales = {};
    return {
        get: function(store_id, year, month, day){
            fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day);
            fSales.on('value', function(snapshot) {
                //console.log(snapshot.val());
            }, undefined, undefined, true);
            sales = $firebaseArray(fSales);
            return sales;
        },
        add: function(item_id, sale_price, year, month, day, time){
            sales.$add({
                item: item_id,
                price: sale_price,
                date: year + "/" + month + "/" + day,
                time: time
            });
        }
    }
}]);
