angular.module('starter.services')
.factory('Sales', ["$q", "$firebaseObject", "Auth", "$firebaseArray", function($q, $firebaseObject, Auth, $firebaseArray) {
    var sales = new Object();
    var users = new Object();
    var sales_array = new Array();
    var fSales = {};
    var fItems = {};
    var is_online;

    return {
        online: function(){
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                if(localStorage.key(i) !== null && localStorage.key(i).indexOf('brg_sales-') == 0){
                    var key_tmp = localStorage.key(i);
                    var keys_tmp = key_tmp.split('-');
                    var store_id = keys_tmp[1];
                    var year = keys_tmp[2];
                    var month = keys_tmp[3];
                    var day = keys_tmp[4];
                    var local_sales = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    //console.log("key_tmp:" + key_tmp + ", store_id:" + store_id + ", year:" + year + ", month:" + month + ", day:" + day);

                    for (var key_ut in local_sales) {
                        console.log("Adding https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key_ut);
                        var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key_ut);
                        var sale = $firebaseObject(fSale);

                        console.log("item_id:" + local_sales[key_ut].item + ", price:" + local_sales[key_ut].price + ", date:" + local_sales[key_ut].date + ", time:" + local_sales[key_ut].time + ", timestamp:" + local_sales[key_ut].timestamp);

                        sale.item = local_sales[key_ut].item;
                        sale.price = local_sales[key_ut].price;
                        sale.discount_rate = local_sales[key_ut].discount_rate;
                        sale.date = local_sales[key_ut].date;
                        sale.time = local_sales[key_ut].time;
                        sale.timestamp = local_sales[key_ut].timestamp;
                        sale.user = local_sales[key_ut].user;
                        sale.retail_price = local_sales[key_ut].retail_price;
                        sale.$save();
                    }
                    console.log("Deleting " + localStorage.key(i));
                    localStorage.removeItem(localStorage.key(i--));
                }
            }
            is_online = true;
        },
        offline: function(){
            is_online = false;
        },
        get: function(store_id, year, month, day){
            if(is_online){
                fSales = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day);
                sales = $firebaseObject(fSales).$loaded();

            }else{
                if (localStorage.getItem('brg_sales-' + store_id + '-' + year + '-' + month + '-' + day) !== null) {
                    sales = JSON.parse(localStorage.getItem('brg_sales-' + store_id + '-' + year + '-' + month + '-' + day));
                }else{
                    sales = new Object();
                }
            }
            return $q.when(sales);
        },

        add: function(store_id, item_id, sale_price, discount_rate, year, month, day, sale_key, user_id, retail_price){
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

            if (sale_key){
                current_ut = sale_key;
            }

            if(is_online){

                console.log("Sale_key FAILED in Sales.js")
                var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + current_ut);
                var sale = $firebaseObject(fSale);
                sale.item = item_id;
                sale.price = sale_price;
                sale.update_date = update_year + "/" + update_month + "/" + update_day;
                sale.date = year + "/" + month + "/" + day;
                sale.time = time;
                sale.timestamp = current_ut;
                sale.user = user_id;
                sale.discount_rate = discount_rate;
                sale.retail_price = retail_price;
                sale.$save();
                
            }else{

                sales[current_ut] = new Object();
                sales[current_ut].item = item_id;
                sales[current_ut].price = sale_price;
                sales[current_ut].update_date = update_year + "/" + update_month + "/" + update_day;
                sales[current_ut].date = year + "/" + month + "/" + day;
                sales[current_ut].time = time;
                sales[current_ut].timestamp = current_ut;
                sales[current_ut].user = user_id;
                sales[current_ut].discount_rate = discount_rate;
                sales[current_ut].retail_price = retail_price;

                localStorage.setItem('brg_sales-' + store_id + '-' + year + '-' + month + '-' + day, JSON.stringify(sales));
            }
        },

        remove: function(store_id, year, month, day, key){
            var now = new Date();
            var current_ut = now.getTime();

            if(is_online){
                var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key);
                var sale = $firebaseObject(fSale);
                sale.$remove().then(function(fSale){
                    console.log("Data removed from server");
                }, function(error) {
                    console.log("Error:", error);
                });
            }else{
                delete sales[key];
            }
        },

        close: function(store_id, year, month, day, user_id){
            var now = new Date();
            var hour = now.getHours();
            var minute = now.getMinutes();
            if (minute < 10) { minute = '0' + minute; }
            var time = hour + ':' + minute;
            var current_ut = now.getTime();

            var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/CLOSED");
            var sale = $firebaseObject(fSale);

            sale.item = "CLOSED";
            sale.date = year + "/" + month + "/" + day;
            sale.time = time;
            sale.timestamp = current_ut;
            sale.discount_rate = 0;
            sale.user = user_id;
            sale.$save();
        },

        on_timeout: function(){
            onOffline();
        }
    }
}]);
