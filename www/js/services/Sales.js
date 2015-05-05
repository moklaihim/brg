angular.module('starter.services')
.factory('Sales', ["$timeout", "$firebaseObject", function($timeout, $firebaseObject) {
    var sales = {};
    var fSales = {};
    var current_item;
    return {
        get: function(store_id, year, month, day){
            fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day);
            fSales.on('value', function(snapshot) {
                //console.log(snapshot.val());
            }, undefined, undefined, true);
            sales = $firebaseObject(fSales);
            return sales;

        },

        add: function(item_id, sale_price, year, month, day){
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            if (minute < 10) { minute = '0' + minute; }
            var time = hour + ':' + minute;
            var current_ut = now.getTime();

            sales[current_ut] = {item: item_id, price: sale_price, date: year + "/" + month + "/" + day, time: time};
            sales.$save();

            //sales.$add({
            //    item: item_id,
            //    price: sale_price,
            //     date: year + "/" + month + "/" + day,
            //     time: time
            // });
            current_item = '';
        },

        save: function(key, item_id, sale_price, year, month, day){
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            if (minute < 10) { minute = '0' + minute; }
            var time = hour + ':' + minute;
            // var current_ut = now.getTime();

            sales[key] = {item: item_id, price: sale_price, date: year + "/" + month + "/" + day, time: time};
            sales.$save();

        },

        remove: function(key){
            sales[key] = {};
            sales.$save();
        },

        close: function(store_id, year, month, day){
            //Close Sales
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            if (minute < 10) { minute = '0' + minute; }
            var time = hour + ':' + minute;
            sales['CLOSED'] = {item: "CLOSED", date: year + "/" + month + "/" + day, time: time};
            sales.$save();
        },

        check_sales: function(){
            if(!sales){
                return false;
            }else{
                return true;
            }
        }
    }
}]);
