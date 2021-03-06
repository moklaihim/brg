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
                    if(keys_tmp[2].substr(0,2) == "20"){
                      var year = keys_tmp[2];
                      var month = keys_tmp[3];
                      var day = keys_tmp[4];
                    }else{
                      store_id = store_id + "-" + keys_tmp[2];
                      var year = keys_tmp[3];
                      var month = keys_tmp[4];
                      var day = keys_tmp[5];
                    }
                    var local_sales = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    //console.log("key_tmp:" + key_tmp + ", store_id:" + store_id + ", year:" + year + ", month:" + month + ", day:" + day);

                    for (var key_ut in local_sales) {
                        //console.log("Adding https://fiery-heat-6039.firebaseio.com/sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key_ut);                        
                        // Mok Firebase SDK upgrade
                        var config = {
                            apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                            authDomain: "fiery-heat-6039.firebaseapp.com",
                            databaseURL: "https://fiery-heat-6039.firebaseio.com"
                        };

                        var fSale = null;
                        if (firebase.apps.length){
                            fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key_ut);
                        } else {
                            firebase.initializeApp(config);
                            fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key_ut);
                        }    
                        // Mok Firebase SDK upgrade   
                        var sale = $firebaseObject(fSale);

                        console.log("item_id:" + local_sales[key_ut].item + ", price:" + local_sales[key_ut].price + ", date:" + local_sales[key_ut].date + ", time:" + local_sales[key_ut].time + ", timestamp:" + local_sales[key_ut].timestamp);

                        sale.item = local_sales[key_ut].item;
                        sale.price = local_sales[key_ut].price;
                        sale.discount_rate = local_sales[key_ut].discount_rate;
                        sale.date = local_sales[key_ut].date;
                        sale.time = local_sales[key_ut].time;
                        sale.timestamp = local_sales[key_ut].timestamp;
                        sale.user = local_sales[key_ut].user;
                        sale.update_date = local_sales[key_ut].update_date;
                        sale.retail_price = local_sales[key_ut].retail_price;
                        sale.promo_choice = local_sales[key_ut].promo_choice;
                        sale.gift = local_sales[key_ut].gift;
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
                // Mok Firebase SDK upgrade
                var config = {
                    apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                    authDomain: "fiery-heat-6039.firebaseapp.com",
                    databaseURL: "https://fiery-heat-6039.firebaseio.com"
                };

                var fSales = null;
                if (firebase.apps.length){
                    fSales = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day);
                } else {
                    firebase.initializeApp(config);
                    fSales = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day);
                }    
                // Mok Firebase SDK upgrade   
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

        add: function(store_id, item_id, sale_price, discount_rate, promo_choice, gift, year, month, day, sale_key, user_id, retail_price){
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
                // Mok Firebase SDK upgrade
                var config = {
                    apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                    authDomain: "fiery-heat-6039.firebaseapp.com",
                    databaseURL: "https://fiery-heat-6039.firebaseio.com"
                };

                var fSale = null;
                if (firebase.apps.length){
                    fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + current_ut);
                } else {
                    firebase.initializeApp(config);
                    fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + current_ut);
                }    
                // Mok Firebase SDK upgrade   
                var sale = $firebaseObject(fSale);
                sale.item = item_id;
                sale.price = sale_price;
                sale.update_date = update_day + "/" + update_month + "/" + update_year;
                sale.date = day + "/" + month + "/" + year;
                sale.time = time;
                sale.timestamp = current_ut;
                sale.user = user_id;
                sale.discount_rate = discount_rate;
                sale.retail_price = retail_price;
                sale.promo_choice = promo_choice;
                sale.gift = gift;
                sale.$save();
                
            }else{

                sales[current_ut] = new Object();
                sales[current_ut].item = item_id;
                sales[current_ut].price = sale_price;
                sales[current_ut].update_date = update_day + "/" + update_month + "/" + update_year;
                sales[current_ut].date = day + "/" + month + "/" + year;
                sales[current_ut].time = time;
                sales[current_ut].timestamp = current_ut;
                sales[current_ut].user = user_id;
                sales[current_ut].discount_rate = discount_rate;
                sales[current_ut].retail_price = retail_price;
                sales[current_ut].promo_choice = promo_choice;
                sales[current_ut].gift = gift;

                localStorage.setItem('brg_sales-' + store_id + '-' + year + '-' + month + '-' + day, JSON.stringify(sales));
            }
        },

        remove: function(store_id, year, month, day, key){
            // Logging.log2FB($scope.user_detail.email, "starts remove function in Sales.js");
            var now = new Date();
            var current_ut = now.getTime();

            if(is_online){
                // Mok Firebase SDK upgrade
                var config = {
                    apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                    authDomain: "fiery-heat-6039.firebaseapp.com",
                    databaseURL: "https://fiery-heat-6039.firebaseio.com"
                };

                var fSale = null;
                if (firebase.apps.length){
                    fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key);
                } else {
                    firebase.initializeApp(config);
                    fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key);
                }    
                // Mok Firebase SDK upgrade   
                var sale = $firebaseObject(fSale);
                sale.$remove().then(function(fSale){
                    // Logging.log2FB($scope.user_detail.email, key + " removed from Firebase");
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
            var update_year = now.getFullYear();
            var update_month = now.getMonth()+1;
            if (update_month < 10) { update_month = '0' + update_month; }
            var update_day = now.getDate();
            if (update_day < 10) { update_day = '0' + update_day; }

            // Mok Firebase SDK upgrade
            var config = {
                apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                authDomain: "fiery-heat-6039.firebaseapp.com",
                databaseURL: "https://fiery-heat-6039.firebaseio.com"
            };

            var fSale = null;
            if (firebase.apps.length){
                fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/CLOSED");
            } else {
                firebase.initializeApp(config);
                fSale = firebase.database().ref("sales/" + store_id + "/" + year + "/" + month + "/" + day + "/CLOSED");
            }    
            // Mok Firebase SDK upgrade   
            var sale = $firebaseObject(fSale);

            sale.item = "CLOSED";
            sale.date = year + "/" + month + "/" + day;
            sale.update_date = update_day + "/" + update_month + "/" + update_year;
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
