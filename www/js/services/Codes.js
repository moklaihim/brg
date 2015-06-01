angular.module('starter.services')
.factory('Codes', ["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray) {

    var brands = new Object();
    var brands_array = new Array();
    var colors = new Object();
    var colors_array = new Array();
    var sizes = new Object();
    var sizes_array = new Array();

    var is_online;


    function createInitialData(){
        brands['hb'] = {id: 'hb', name: 'HB', order: 1};
        brands['f'] = {id: 'f', name: 'F', order: 2};
        brands['r'] = {id: 'r', name: 'R', order: 3};
        brands['h'] = {id: 'h', name: 'H', order: 4};
        brands['s'] = {id: 's', name: 'S', order: 5};
        brands.$save();

        colors['blk'] = {id: 'blk', name: 'BLK', color: '#000000', backgroundcolor: '#ffffff', order: 1};
        colors['blu'] = {id: 'blu', name: 'BLU', color: '#000000', backgroundcolor: '#ffffff', order: 2};
        colors['grn'] = {id: 'grn', name: 'GRN', color: '#000000', backgroundcolor: '#ffffff', order: 3};
        colors['brn'] = {id: 'brn', name: 'BRN', color: '#000000', backgroundcolor: '#ffffff', order: 4};
        colors.$save();

        sizes['38'] = {id: '38', name: '38', order: 1};
        sizes['39'] = {id: '39', name: '39', order: 2};
        sizes['40'] = {id: '40', name: '40', order: 3};
        sizes['41'] = {id: '41', name: '41', order: 4};
        sizes['42'] = {id: '42', name: '42', order: 5};
        sizes['43'] = {id: '43', name: '43', order: 6};
        sizes['44'] = {id: '44', name: '44', order: 7};
        sizes['45'] = {id: '45', name: '45', order: 8};
        sizes.$save();
    }

    return {
        online: function(){
            var fBrands= new Firebase("https://fiery-heat-6039.firebaseio.com/codes/brands");
            fBrands.on("value", function(snapshot) {
                localStorage.setItem('brg_brands', JSON.stringify(snapshot.val()));
            }); 
            brands = $firebaseObject(fBrands);
            brands_array = $firebaseArray(fBrands);

            var fColors= new Firebase("https://fiery-heat-6039.firebaseio.com/codes/colors");
            fColors.on("value", function(snapshot) {
                localStorage.setItem('brg_colors', JSON.stringify(snapshot.val()));
            }); 
            colors = $firebaseObject(fColors);
            colors_array = $firebaseArray(fColors);

            var fSizes= new Firebase("https://fiery-heat-6039.firebaseio.com/codes/sizes");
            fSizes.on("value", function(snapshot) {
                localStorage.setItem('brg_sizes', JSON.stringify(snapshot.val()));
            }); 
            sizes = $firebaseObject(fSizes);
            sizes_array = $firebaseArray(fSizes);

            //createInitialData();
            is_online = true;
        },

        offline: function(){
            brands = JSON.parse(localStorage.getItem('brg_brands'));
            brands_array = Object.keys(brands).map(function(key) { return brands[key] });
            colors = JSON.parse(localStorage.getItem('brg_colors'));
            colors_array = Object.keys(colors).map(function(key) { return colors[key] });
            sizes = JSON.parse(localStorage.getItem('brg_sizes'));
            sizes_array = Object.keys(sizes).map(function(key) { return sizes[key] });

            is_online = false;
        },

        get_brands: function(){
            return brands;
        },

        get_brands_as_array: function(){
            return brands_array;
        },

        get_colors: function(){
            return colors;
        },

        get_colors_as_array: function(){
            return colors_array;
        },

        get_sizes: function(){
            return sizes;
        },

        get_sizes_as_array: function(){
            return sizes_array;
        }
    }
}]);
