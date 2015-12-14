angular.module('starter.services')
.factory('Items', ["$rootScope", "$firebaseObject", "$firebaseArray", "$state", function($rootScope, $firebaseObject, $firebaseArray, $state) {

    var items = new Object();
    var items_array = new Array();
    var is_online;
    var fItems_all = new Firebase("https://fiery-heat-6039.firebaseio.com/items");
    var isUpdated = false;

     function createInitialData(){
         items = $firebaseObject(fItems_all);
            // items['R89012-WHT-39'] = {id:'R89012-WHT-39', retail_price:'19'};
            

         items.$save();
     };

    return {
        online: function(){
            // Logging.log2FB($scope.user_detail.email, "starts online function in Items.js service");
            /*
            fItems.on("value", function(snapshot) {
                localStorage.setItem('brg_items', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            }); 
            */

            //items = $firebaseObject(fItems);
            //items_array = $firebaseArray(fItems);
            var fb_item_ver = 0;
            var local_item_ver = localStorage.getItem('brg_items_ver');
            var fVer = new Firebase("https://fiery-heat-6039.firebaseio.com/ver/items");
            //var itemVer = $firebaseObject(fVer);

            fVer.on("value", function(snapshot){
              fb_item_ver = snapshot.val();
              console.log("isUpdated " + fb_item_ver + " & " + local_item_ver);
              if( fb_item_ver > local_item_ver ){
                isUpdated = true;
              }else{
                isUpdated = false;
              }
            });

            // createInitialData();
            if(localStorage.getItem('brg_items') !== null){
              items = JSON.parse(localStorage.getItem('brg_items'));
              items_array = Object.keys(items).map(function(key) { return items[key] });
            }
            is_online = true;
            
            // Logging.log2FB($scope.user_detail.email, "ends online function in Items.js service");
        },

        offline: function(){
            // Logging.log2FB($scope.user_detail.email, "starts offline function in Items.js service");
            if(localStorage.getItem('brg_items') !== null){
              items = JSON.parse(localStorage.getItem('brg_items'));
              items_array = Object.keys(items).map(function(key) { return items[key] });
            }
            is_online = false;
            // Logging.log2FB($scope.user_detail.email, "ends offline function in Items.js service");
        },

        isUpdated: function(){
            // Logging.log2FB($scope.user_detail.email, "starts isUpdated function in Items.js service");
            console.log("isUpdated started");
            return isUpdated;
            // Logging.log2FB($scope.user_detail.email, "ends isUpdated function in Items.js service");
        },

        update: function(){
            // Logging.log2FB($scope.user_detail.email, "starts update function in Items.js service");
            //items = $firebaseObject(fItems_all);
            //items_array = $firebaseArray(fItems_all);
            fItems_all.once("value", function(snapshot) {
              localStorage.setItem('brg_items', JSON.stringify(snapshot.val()));
              items = JSON.parse(localStorage.getItem('brg_items'));
              items_array = Object.keys(items).map(function(key) { return items[key] });

              var fVer = new Firebase("https://fiery-heat-6039.firebaseio.com/ver/items");
              fVer.once("value", function(snapshot){
                localStorage.setItem('brg_items_ver', snapshot.val());
              });

              isUpdated = false;
              console.log("broadcast refreshComplete");
              $rootScope.$broadcast('updatedbCompleted');
              //$rootScope.$broadcast('scroll.refreshComplete');
            }); 
            // Logging.log2FB($scope.user_detail.email, "ends update function in Items.js service");
        },

        get: function(){
            // Logging.log2FB($scope.user_detail.email, "starts get function in Items.js service");
            return items;
        },

        get_as_array: function(){
            // Logging.log2FB($scope.user_detail.email, "starts get_as_array function in Items.js service");
            return items_array;
        },

        get_retail_price: function(id){
            // Logging.log2FB($scope.user_detail.email, "starts get_retail_price function in Items.js service");
            var retail_price = items[id].retail_price;
            return retail_price;
        },

        remove: function(key){
            // Logging.log2FB($scope.user_detail.email, "starts remove function in Items.js service");
            var now = new Date();
            var current_ut = now.getTime();

            if(is_online){
                if(key){
                  // var fSale = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + store_id + "/" + year + "/" + month + "/" + day + "/" + key);
                  var fItems_remove = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + key);
                  var item = $firebaseObject(fItems_remove);
                  item.$remove().then(function(fItems_remove){
                    console.log("Item" + key +"removed from server");
                    var fVer = new Firebase("https://fiery-heat-6039.firebaseio.com/ver");
                    fVer.set({
                        items: current_ut
                    });
                    localStorage.setItem('brg_items_ver', current_ut);

                  }, function(error) {
                    console.log("Error:", error);
                  });


                  delete items[key];
                  localStorage.setItem('brg_items', JSON.stringify(items));
                  items_array = Object.keys(items).map(function(key) { return items[key] });
                }
            }else{
                delete items[key];
                localStorage.setItem('brg_items', JSON.stringify(items));
                items_array = Object.keys(items).map(function(key) { return items[key] });
            }
            // Logging.log2FB($scope.user_detail.email, "ends remove function in Items.js service");
        },

        add: function(item_id, retail_price){
            // Logging.log2FB($scope.user_detail.email, "starts add function in Items.js service");
            var now = new Date();
            var current_ut = now.getTime();
            var fb_item_id = item_id;
            if(item_id.indexOf(".") > -1){
                fb_item_id = item_id.replace(/\./g, '_2E')
            }
            console.log("item id is " + fb_item_id);
            var fItems_add = new Firebase("https://fiery-heat-6039.firebaseio.com/items/" + fb_item_id);


            if(is_online){
                var item = $firebaseObject(fItems_add);
                item.id = item_id;
                item.retail_price = retail_price;
                item.timestamp = current_ut;
                item.$save().then(function(fItems_add){
                    var fVer = new Firebase("https://fiery-heat-6039.firebaseio.com/ver");
                    fVer.set({
                        items: current_ut
                    });
                    localStorage.setItem('brg_items_ver', current_ut);
                });
                // if(!item_edit_key){
                //     items[item_id] = new Object();
                // }
                items[fb_item_id] = new Object();
                items[fb_item_id].id = item_id;
                items[fb_item_id].retail_price = retail_price;
                items[fb_item_id].timestamp = current_ut;
                localStorage.setItem('brg_items', JSON.stringify(items));
                items_array = Object.keys(items).map(function(key) { return items[key] });
            }else{
                items[fb_item_id] = new Object();
                items[fb_item_id].id = item_id;
                items[fb_item_id].retail_price = retail_price;
                items[fb_item_id].timestamp = current_ut;
                localStorage.setItem('brg_items', JSON.stringify(items));
                items_array = Object.keys(items).map(function(key) { return items[key] });
            }
            // Logging.log2FB($scope.user_detail.email, "ends add function in Items.js service");
        }
    }

}]);
