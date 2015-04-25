angular.module('starter.controllers').controller('SalesCtrl', ["$scope", "$state", "$ionicPopup", "$ionicPlatform", "$firebaseObject", "$firebaseArray", "$cordovaBarcodeScanner", "$cordovaGeolocation", "$cordovaDatePicker", "User", function($scope, $state, $ionicPopup, $ionicPlatform, $firebaseObject, $firebaseArray, $cordovaBarcodeScanner, $cordovaGeolocation, $cordovaDatePicker, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});

    var fItems;
    var fStores;

    setDate(new Date());
    //setStore();
    if(localStorage.getItem("store_date") == $scope.date){
        $scope.store_id = localStorage.getItem("store_id");
        $scope.store_name = localStorage.getItem("store_name");
        updateSales();
    }else{
        $scope.showInitialStoreSelectMsg = true;
        showStoreList();
    }

    connectFirebase();
    //updateSales();
    //createInitialData();

    $scope.query = {
        text: '' 
    };

    $scope.new_item = {
        id: '',
        retail_price: ''
    }

    $scope.sale = {
        item_id: '',
        retail_price: '',
        sale_price: '',
        qty: '',
        date: '',
        time: ''
    }

    function setStore(){
        //$scope.store_id = "bm_taka";
        //$scope.store_name = "BM@TAKA";
        $scope.showInitialStoreSelectMsg = true;
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = false;
        $scope.showStoreView = true;
        $scope.hideSalesView = true;
    }

    function setDate(date){
        //var today=new Date(); 
        $scope.year = date.getFullYear();
        $scope.month = date.getMonth()+1;
        if ($scope.month < 10) { $scope.month = '0' + $scope.month; }
        $scope.day = date.getDate();
        if ($scope.day < 10) { $scope.day = '0' + $scope.day; }
        $scope.date = $scope.year + "/" + $scope.month + "/" + $scope.day;
        updateSales();
    }

    function connectFirebase(){

        OfflineFirebase.restore();
        fStores = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/stores");
        fStores.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.stores = $firebaseObject(fStores);
        refreshStoreArray();

        fItems = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/items");
        fItems.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.items = $firebaseObject(fItems);
        refreshItemArray();
    }

    function refreshItemArray(){
        $scope.items_array = $firebaseArray(fItems);
    }

    function refreshStoreArray(){
        $scope.stores_array = $firebaseArray(fStores);
    }

    function updateSales(){
        var fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + $scope.store_id + "/" + $scope.year + "/" + $scope.month + "/" + $scope.day);
        fSales.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.sales = $firebaseArray(fSales);
    }

    function createInitialData(){
        $scope.stores['taka'] = {id: 'taka', name: 'TAKA', lat: 1.302479, lng: 103.834615};
        $scope.stores['isetan_scotts'] = {id: 'isetan_scotts', name: 'ISETAN SCOTTS', lat: 1.305732, lng: 103.8315};
        $scope.stores['isetan_tmp'] = {id: 'isetan_tmp', name: 'ISETAN TMP', lat: 1.352492, lng: 103.944797};
        $scope.stores['isetan_nex'] = {id: 'isetan_nex', name: 'ISETAN NEX', lat: 1.305589, lng: 103.831510};
        $scope.stores['isetan_katong'] = {id: 'isetan_katong', name: 'ISETAN KATONG', lat: 1.301547, lng: 103.904688};
        $scope.stores['isetan_westgate'] = {id: 'isetan_westgate', name: 'ISETAN WESTGATE', lat: 1.334033, lng: 103.742837};
        $scope.stores['robs_rc'] = {id: 'robs_rc', name: 'Robs RC', lat: 1.293775, lng: 103.852741};
        $scope.stores['robs_orch'] = {id: 'robs_orch', name: 'Robs Orch', lat: 1.302399, lng: 103.837175};
        $scope.stores['robs_jem'] = {id: 'robs_jem', name: 'Robs JEM', lat: 1.333381, lng: 103.743388};
        $scope.stores['tangs_orch'] = {id: 'tangs_orch', name: 'Tangs Orch', lat: 1.304975, lng: 103.832957};
        $scope.stores['tangs_vivo'] = {id: 'tangs_vivo', name: 'Tangs Vivo', lat: 1.264797, lng: 103.822047};
        $scope.stores['bhg_bugis'] = {id: 'bhg_bugis', name: 'BHG Bugis', lat: 1.300001, lng: 103.855588};
        $scope.stores['metro_paragon'] = {id: 'metro_paragon', name: 'Metro Paragon', lat: 1.303753, lng: 103.835716};
        $scope.stores['metro_woodlands'] = {id: 'metro_woodlands', name: 'Metro Woodlands', lat: 1.435820, lng: 103.786139};
        $scope.stores['metro_city_sq'] = {id: 'metro_city_sq', name: 'Metro City Sq', lat: 1.311333, lng: 103.856434};
        $scope.stores['events_atriums'] = {id: 'events_atriums', name: 'Events / Atriums', lat: 0, lng: 0};
        $scope.stores.$save();
    };

    function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }


    function showStoreList(){
        $scope.hideSalesView = true;
        $scope.showSpinner = true;
        var posOptions = {timeout: 5000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                console.log(lat + " " + lng + " OK");
                for (var i = 0; i < $scope.stores_array.length; i++) {
                    $scope.stores_array[i].distance = Math.round(distance(lat, lng, $scope.stores_array[i].lat, $scope.stores_array[i].lng, "K")*1000);
                    if($scope.stores_array[i].distance > 1000){
                        $scope.stores_array[i].distance_disp = Math.round($scope.stores_array[i].distance / 100) / 10 + "km";
                    }else{
                        $scope.stores_array[i].distance_disp = $scope.stores_array[i].distance + "m";
                    }
                }
                $scope.showSpinner = false;
                $scope.showManualAddSalePage1 = false;
                $scope.showManualAddSalePage2 = false;
                $scope.showStoreView = true;
            }, function(err) {
                $scope.showSpinner = false;
                $scope.showManualAddSalePage1 = false;
                $scope.showManualAddSalePage2 = false;
                $scope.showStoreView = true;
            });
    }
    $scope.showStoreList = showStoreList;

    $scope.showDatePicker = function(){
        var options = {
            mode: 'date',
            date: new Date(),
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
            setDate(date);
        });
    };

    $scope.selectStore = function($store_id, $store_name){
        $scope.store_id = $store_id;
        $scope.store_name = $store_name;
        updateSales();

        var today=new Date(); 
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        if (month < 10) { month = '0' + month; }
        var day = today.getDate();
        if (day < 10) { ay = '0' + day; }
        var date = year + "/" + month + "/" + day;

        localStorage.setItem("store_date", date);
        localStorage.setItem("store_id", $store_id);
        localStorage.setItem("store_name", $store_name);
        $scope.showInitialStoreSelectMsg = false;
        $scope.showStoreView = false;
        $scope.hideSalesView = false;
        $scope.showInitialStoreSelectMsg = false;
    };

    $scope.manualAddSalePage1 = function(){
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.items = $firebaseArray(ref.child("items"));
        $scope.query.text = "";
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = true;
        $scope.showManualAddSalePage1 = true;
    };

    $scope.manualAddSalePage2 = function($item_id){
        $scope.sale.item_id = $item_id;
        $scope.sale.retail_price = $scope.items[$item_id].retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale.sale_price = '';
        $scope.sale.qty = 1;
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.manualAddSaleCancel = function(){
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = false;
    };

    $scope.manualAddSelectCancel = function(){
        $scope.showManualAddSalePage1 = false;
        $scope.hideSalesView = false;
    };

    $scope.manualAddSaleOK = function(){
        //$scope.sale_price = $sale_price;
        //var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.sales = $firebaseArray(ref.child("sales/" + $scope.store_id));
        $scope.sales.$add({
            item: $scope.sale.item_id,
            price: $scope.sale.sale_price,
            date: $scope.year + "/" + $scope.month + "/" + $scope.day,
            time: "12:30"
        });
        $scope.showManualAddSalePage2 = false;
        $scope.hideSalesView = false;
    };

    $scope.scanAddSalePage1 = function(){
        $ionicPlatform.ready(function(){
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    $scope.item_id = barcodeData.text;
                    if (!$scope.items.hasOwnProperty(barcodeData.text)){
                        $scope.items[$item_id] = {id: $item_id};
                        $scope.items.$save();
                        refreshItemArray();
                    };
                }, function(error) {
                    // An error occurred
                });
        });

        $scope.hideSalesView = true;
        $scope.showManualAddSalePage2 = true;
    };

    $scope.manualAddItemPage1 = function(){
        $scope.new_item.id = '';
        $scope.new_item.retail_price = '';
        $scope.showManualAddSalePage1 = false;
        $scope.showManualAddItemPage1 = true;
    }

    $scope.manualAddItemOK = function(){
        //console.log("manualAddItemOK Started");
        //console.log($scope.new_item.item_id);
        $scope.items[$scope.new_item.id] = {id: $scope.new_item.id, retail_price: $scope.new_item.retail_price};
        $scope.items.$save();
        refreshItemArray();

        $scope.sale.item_id = $scope.new_item.id;
        $scope.sale.retail_price = $scope.new_item.retail_price;
        $scope.sale.discount_rate = '';
        $scope.sale_price = '';
        $scope.sale.qty = 1;
        $scope.showManualAddItemPage1 = false;
        $scope.showManualAddSalePage2 = true;
    }

    $scope.removeSale = function (key) {
        var fSales = new OfflineFirebase("https://fiery-heat-6039.firebaseio.com/sales/" + $scope.store_id + "/" + $scope.year + "/" + $scope.month + "/" + $scope.day);
        fSales.on('value', function(snapshot) {
            //console.log(snapshot.val());
        }, undefined, undefined, true);
        $scope.sales = $firebaseArray(fSales);
        // $scope.sales.$remove(key);  

        $scope.sales.$remove(key).then(function(ref) {
  // data has been deleted locally and in Firebase
        }, function(error) {
        console.log("Error:", error);
        });
    }
}])
