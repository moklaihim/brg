angular.module('starter.services')
.factory('Sales', ["$timeout", "$firebaseArray", function($timeout, $firebaseArray) {
    var sales = {};
    var fSales = {};
    var current_item;
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
            current_item = '';
        },
        remove: function(key){
            sales.$remove(key).then(function(ref) {
                //data has been deleted locally and in Firebase
            }, function(error) {
                //console.log("Error: failed to delete", error);
            });
        },
        set_current_item: function(item_id) {
            current_item = item_id;
        },
        get_current_item: function(){
            return current_item;
        },
        check_sales(){
            if(!sales){
                return false;
            }else{
                return true;
            }
        }
    }
}]);
