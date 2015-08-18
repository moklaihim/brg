angular.module('starter.services')
.factory('Stores', ["$state", "$q", "$firebaseObject", "$firebaseArray", function($state, $q, $firebaseObject, $firebaseArray) {
    var stores;
    var stores_array;
    var is_online;

    //createInitialDate();

    function createInitialData(){
        stores['taka'] = {id: 'taka', name: 'TAKA', lat: 1.302479, lng: 103.834615, timestamp: 1430663266989};
        stores['isetan_scotts'] = {id: 'isetan_scotts', name: 'ISETAN SCOTTS', lat: 1.305732, lng: 103.8315, timestamp: 1430663266989};
        stores['isetan_tmp'] = {id: 'isetan_tmp', name: 'ISETAN TMP', lat: 1.352492, lng: 103.944797, timestamp: 1430663266989};
        stores['isetan_nex'] = {id: 'isetan_nex', name: 'ISETAN NEX', lat: 1.350708, lng: 103.872240, timestamp: 1430663266989};
        stores['isetan_katong'] = {id: 'isetan_katong', name: 'ISETAN KATONG', lat: 1.301547, lng: 103.904688, timestamp: 1430663266989};
        stores['isetan_westgate'] = {id: 'isetan_westgate', name: 'ISETAN WESTGATE', lat: 1.334033, lng: 103.742837, timestamp: 1430663266989};
        stores['robs_rc'] = {id: 'robs_rc', name: 'Robs RC', lat: 1.293775, lng: 103.852741, timestamp: 1430663266989};
        stores['robs_orch'] = {id: 'robs_orch', name: 'Robs Orch', lat: 1.302399, lng: 103.837175, timestamp: 1430663266989};
        stores['robs_jem'] = {id: 'robs_jem', name: 'Robs JEM', lat: 1.333381, lng: 103.743388, timestamp: 1430663266989};
        stores['tangs_orch'] = {id: 'tangs_orch', name: 'Tangs Orch', lat: 1.304975, lng: 103.832957, timestamp: 1430663266989};
        stores['tangs_vivo'] = {id: 'tangs_vivo', name: 'Tangs Vivo', lat: 1.264797, lng: 103.822047, timestamp: 1430663266989};
        stores['bhg_bugis'] = {id: 'bhg_bugis', name: 'BHG Bugis', lat: 1.300001, lng: 103.855588, timestamp: 1430663266989};
        stores['metro_paragon'] = {id: 'metro_paragon', name: 'Metro Paragon', lat: 1.303753, lng: 103.835716, timestamp: 1430663266989};
        stores['metro_woodlands'] = {id: 'metro_woodlands', name: 'Metro Woodlands', lat: 1.435820, lng: 103.786139, timestamp: 1430663266989};
        stores['metro_city_sq'] = {id: 'metro_city_sq', name: 'Metro City Sq', lat: 1.311333, lng: 103.856434, timestamp: 1430663266989};
        stores.$save();
    };

    return {
        online: function(){
            var fb_path = "https://fiery-heat-6039.firebaseio.com/stores";
            var fStores = new Firebase(fb_path);

            fStores.on("value", function(snapshot) {
                localStorage.setItem('brg_stores', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            });

            stores = $firebaseObject(fStores);
            stores_array = $firebaseArray(fStores).$loaded();
        },
        offline: function(){
            stores = JSON.parse(localStorage.getItem('brg_stores'));
            stores_array = Object.keys(stores).map(function(key) { return stores[key] });
        },
        get_list: function(){
            return stores;
        },
        get_list_as_array: function(){
            return $q.when(stores_array);
        }
    }
}]);
