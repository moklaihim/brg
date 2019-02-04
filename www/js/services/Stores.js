angular.module('starter.services')
.factory('Stores', ["$state", "$q", "$firebaseObject", "$firebaseArray", function($state, $q, $firebaseObject, $firebaseArray) {
    var stores;
    var stores_array;
    var is_online;

    function createInitialData(){
        stores['bhg-bugis-ladies'] = {id: 'bhg-bugis-ladies', name: 'BHG - BUGIS - LADIES', lat: 1.300001, lng: 103.855588, target: 'ladies'};
        stores['bhg-bugis-men'] = {id: 'bhg-bugis-men', name: 'BHG - BUGIS - MEN', lat: 1.300001, lng: 103.855588, target: 'men'};
        stores['events'] = {id: 'events', name: 'EVENTS', lat: 0, lng: 0, target: 'both'};
        stores['isetan_katong-men'] = {id: 'isetan_katong-men', name: 'ISETAN KATONG - MEN', lat: 1.301547, lng: 103.904688, target: 'men'};
        stores['isetan_scotts-men'] = {id: 'isetan_scotts-men', name: 'ISETAN SCOTTS - MEN', lat: 1.305732, lng: 103.8315, target: 'men'};
        stores['isetan_seragoon-men'] = {id: 'isetan_seragoon-men', name: 'ISETAN SERAGOON - MEN', lat: 1.350708, lng: 103.87224, target: 'men'};
        stores['isetan_tampines-men'] = {id: 'isetan_tampines-men', name: 'ISETAN TAMPINES - MEN', lat: 1.352492, lng: 103.944797, target: 'men'};
        stores['isetan_westgate-men'] = {id: 'isetan_westgate-men', name: 'ISETAN WESTGATE - MEN', lat: 1.334033, lng: 103.742837, target: 'men'};
        stores['metro_centrepoint-men'] = {id: 'metro_centrepoint-men', name: 'METRO CENTREPOINT - MEN', lat: 1.302022, lng: 103.839698, target: 'men'};
        stores['metro_expo-men'] = {id: 'metro_expo-men', name: 'METRO EXPO - MEN', lat: 0, lng: 0, target: 'men'};
        stores['metro_paragon-men'] = {id: 'metro_paragon-men', name: 'METRO PARAGON - MEN', lat: 1.303753, lng: 103.835716, target: 'men'};
        stores['metro_woodlands-men'] = {id: 'metro_woodlands-men', name: 'METRO WOODLANDS - MEN', lat: 1.43582, lng: 103.786139, target: 'men'};
        stores['plaza_singapura_event'] = {id: 'plaza_singapura_event', name: 'PLAZA SINGAPURA EVENT', lat: 1.300481, lng: 103.844986, target: 'both'};
        stores['robinson_expo-ladies'] = {id: 'robinson_expo-ladies', name: 'ROBINSON EXPO - LADIES', lat: 0, lng: 0, target: 'ladies'};
        stores['robinson_expo-men'] = {id: 'robinson_expo-men', name: 'ROBINSON EXPO - MEN', lat: 0, lng: 0, target: 'men'};
        stores['robinson_jem-ladies'] = {id: 'robinson_jem-ladies', name: 'ROBINSON JEM - LADIES', lat: 1.333381, lng: 103.743388, target: 'ladies'};
        stores['robinson_jem-men'] = {id: 'robinson_jem-men', name: 'ROBINSON JEM - MEN', lat: 1.333381, lng: 103.743388, target: 'men'};
        stores['robinson_orchard-ladies'] = {id: 'robinson_orchard-ladies', name: 'ROBINSON ORCHARD - LADIES', lat: 1.302399, lng: 103.837175, target: 'ladies'};
        stores['robinson_orchard-men'] = {id: 'robinson_orchard-men', name: 'ROBINSON ORCHARD - MEN', lat: 1.302399, lng: 103.837175, target: 'men'};
        stores['robinson_rc-ladies'] = {id: 'robinson_rc-ladies', name: 'ROBINSON RC - LADIES', lat: 1.293775, lng: 103.852741, target: 'ladies'};
        stores['robinson_rc-men'] = {id: 'robinson_rc-men', name: 'ROBINSON RC - MEN', lat: 1.293775, lng: 103.852741, target: 'men'};
        stores['takashimaya-event-ladies'] = {id: 'takashimaya-event-ladies', name: 'TAKASHIMAYA - EVENT - LADIES', lat: 1.302479, lng: 103.834615, target: 'ladies'};
        stores['takashimaya-event-men'] = {id: 'takashimaya-event-men', name: 'TAKASHIMAYA - EVENT - MEN', lat: 1.302479, lng: 103.834615, target: 'men'};
        stores['takashimaya-ladies'] = {id: 'takashimaya-ladies', name: 'TAKASHIMAYA - LADIES', lat: 1.302479, lng: 103.834615, target: 'ladies'};
        stores['takashimaya-men'] = {id: 'takashimaya-men', name: 'TAKASHIMAYA - MEN', lat: 1.302479, lng: 103.834615, target: 'men'};
        stores['tangs_orchard-men'] = {id: 'tangs_orchard-men', name: 'TANGS ORCHARD - MEN', lat: 1.304975, lng: 103.832957, target: 'men'};
        stores['tangs_vivo_atrium-ladies'] = {id: 'tangs_vivo_atrium-ladies', name: 'TANGS VIVO ATRIUM - LADIES', lat: 1.264797, lng: 103.822047, target: 'ladies'};
        stores['tangs_vivo_atrium-men'] = {id: 'tangs_vivo_atrium-men', name: 'TANGS VIVO ATRIUM - MEN', lat: 1.264797, lng: 103.822047, target: 'men'};
        stores['tangs_vivo_city-ladies'] = {id: 'tangs_vivo_city-ladies', name: 'TANGS VIVO CITY - LADIES', lat: 1.264797, lng: 103.822047, target: 'ladies'};
        stores['tangs_vivo_city-men'] = {id: 'tangs_vivo_city-men', name: 'TANGS VIVO CITY - MEN', lat: 1.264797, lng: 103.822047, target: 'men'};
        stores.$save();
    };

    return {
        online: function(){
            //var fb_path = "https://fiery-heat-6039.firebaseio.com/stores";

            // Mok Firebase SDK upgrade
            var config = {
                apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                authDomain: "fiery-heat-6039.firebaseapp.com",
                databaseURL: "https://fiery-heat-6039.firebaseio.com"
            };

            var fStores = null;
            if (firebase.apps.length){
                fStores = firebase.database().ref("stores");
            } else {
                firebase.initializeApp(config);
                fStores = firebase.database().ref("stores");
            }    
            // Mok Firebase SDK upgrade              

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
            //createInitialData();
        },
        offline: function(){
            stores = JSON.parse(localStorage.getItem('brg_stores'));
            console.log("stores: ", stores);
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
