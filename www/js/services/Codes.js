angular.module('starter.services')
.factory('Codes', ["$firebaseObject", "$firebaseArray", "$state", function($firebaseObject, $firebaseArray, $state) {

    var brands = new Object();
    var brands_array = new Array();
    var colors = new Object();
    var colors_array = new Array();
    var sizes = new Object();
    var sizes_array = new Array();
    var promos = new Object();
    var promos_array = new Array();

    var is_online;
    //createInitialData();

    function createInitialData(){

        brands['aa'] = {id: 'hb', name: 'HB', order: 1};
        // brands['f'] = {id: 'f', name: 'F', order: 2};
        // brands['r'] = {id: 'r', name: 'R', order: 3};
        // brands['h'] = {id: 'h', name: 'H', order: 4};
        // brands['s'] = {id: 's', name: 'S', order: 5};

        brands.$save();

        // colors['alm'] = {id: 'alm', name: 'ALM', color: '#000000', backgroundcolor: '#ffffff', order: 1};
        // colors['bam'] = {id: 'bam', name: 'BAM', color: '#000000', backgroundcolor: '#ffffff', order: 2};
        // colors['bkk'] = {id: 'bkk', name: 'BKK', color: '#000000', backgroundcolor: '#ffffff', order: 3};
        // colors['bcf'] = {id: 'bcf', name: 'BCF', color: '#000000', backgroundcolor: '#ffffff', order: 4};
        // colors['bei'] = {id: 'bei', name: 'BEI', color: '#000000', backgroundcolor: '#ffffff', order: 5};
        // colors['bie'] = {id: 'bie', name: 'BIE', color: '#000000', backgroundcolor: '#ffffff', order: 6};
        // colors['blk'] = {id: 'blk', name: 'BLK', color: '#000000', backgroundcolor: '#ffffff', order: 7};
        // colors['blu'] = {id: 'blu', name: 'BLU', color: '#000000', backgroundcolor: '#ffffff', order: 8};
        // colors['blue'] = {id: 'blue', name: 'BLUE', color: '#000000', backgroundcolor: '#ffffff', order: 9};
        // colors['brn'] = {id: 'brn', name: 'BRN', color: '#000000', backgroundcolor: '#ffffff', order: 10};
        // colors['brw'] = {id: 'brw', name: 'BRW', color: '#000000', backgroundcolor: '#ffffff', order: 11};
        // colors['bur'] = {id: 'bur', name: 'BUR', color: '#000000', backgroundcolor: '#ffffff', order: 12};
        // colors['burg'] = {id: 'burg', name: 'BURG', color: '#000000', backgroundcolor: '#ffffff', order: 13};
        // colors['bwr'] = {id: 'bwr', name: 'BWR', color: '#000000', backgroundcolor: '#ffffff', order: 14};
        // colors['camel'] = {id: 'camel', name: 'CAMEL', color: '#000000', backgroundcolor: '#ffffff', order: 15};
        // colors['cff'] = {id: 'cff', name: 'CFF', color: '#000000', backgroundcolor: '#ffffff', order: 16};
        // colors['chp'] = {id: 'chp', name: 'CHP', color: '#000000', backgroundcolor: '#ffffff', order: 17};
        // colors['cof'] = {id: 'cof', name: 'COF', color: '#000000', backgroundcolor: '#ffffff', order: 18};
        // colors['coff'] = {id: 'coff', name: 'COFF', color: '#000000', backgroundcolor: '#ffffff', order: 19};
        // colors['cop'] = {id: 'cop', name: 'COP', color: '#000000', backgroundcolor: '#ffffff', order: 20};
        // colors['copp'] = {id: 'copp', name: 'COPP', color: '#000000', backgroundcolor: '#ffffff', order: 21};
        // colors['dblu1'] = {id: 'd.blu', name: 'D.BLU', color: '#000000', backgroundcolor: '#ffffff', order: 22};
        // colors['dblue'] = {id: 'd.blue', name: 'D.BLUE', color: '#000000', backgroundcolor: '#ffffff', order: 23};
        // colors['dblu2'] = {id: 'dblu', name: 'DBLU', color: '#000000', backgroundcolor: '#ffffff', order: 24};
        // colors['dbn'] = {id: 'dbn', name: 'DBN', color: '#000000', backgroundcolor: '#ffffff', order: 25};
        // colors['dbr'] = {id: 'dbr', name: 'DBR', color: '#000000', backgroundcolor: '#ffffff', order: 26};
        // colors['dbrn'] = {id: 'dbrn', name: 'DBRN', color: '#000000', backgroundcolor: '#ffffff', order: 27};
        // colors['dcf'] = {id: 'dcf', name: 'DCF', color: '#000000', backgroundcolor: '#ffffff', order: 28};
        // colors['dcoff'] = {id: 'dcoff', name: 'DCOFF', color: '#000000', backgroundcolor: '#ffffff', order: 29};
        // colors['dgrn'] = {id: 'dgrn', name: 'DGRN', color: '#000000', backgroundcolor: '#ffffff', order: 30};
        // colors['gbe'] = {id: 'gbe', name: 'GBE', color: '#000000', backgroundcolor: '#ffffff', order: 31};
        // colors['gbk'] = {id: 'gbk', name: 'GBK', color: '#000000', backgroundcolor: '#ffffff', order: 32};
        // colors['gbr'] = {id: 'gbr', name: 'GBR', color: '#000000', backgroundcolor: '#ffffff', order: 33};
        // colors['gld'] = {id: 'gld', name: 'GLD', color: '#000000', backgroundcolor: '#ffffff', order: 34};
        // colors['gold'] = {id: 'gold', name: 'GOLD', color: '#000000', backgroundcolor: '#ffffff', order: 35};
        // colors['green'] = {id: 'green', name: 'GREEN', color: '#000000', backgroundcolor: '#ffffff', order: 36};
        // colors['grey'] = {id: 'grey', name: 'GREY', color: '#000000', backgroundcolor: '#ffffff', order: 37};
        // colors['grn'] = {id: 'grn', name: 'GRN', color: '#000000', backgroundcolor: '#ffffff', order: 38};
        // colors['gry'] = {id: 'gry', name: 'GRY', color: '#000000', backgroundcolor: '#ffffff', order: 39};
        // colors['kbn'] = {id: 'kbn', name: 'KBN', color: '#000000', backgroundcolor: '#ffffff', order: 40};
        // colors['khk'] = {id: 'khk', name: 'KHK', color: '#000000', backgroundcolor: '#ffffff', order: 41};
        // colors['krb'] = {id: 'krb', name: 'KRB', color: '#000000', backgroundcolor: '#ffffff', order: 42};
        // colors['kwr'] = {id: 'kwr', name: 'KWR', color: '#000000', backgroundcolor: '#ffffff', order: 43};
        // colors['lblu'] = {id: 'l.blu', name: 'L.BLU', color: '#000000', backgroundcolor: '#ffffff', order: 44};
        // colors['lbrn'] = {id: 'l.brn', name: 'L.BRN', color: '#000000', backgroundcolor: '#ffffff', order: 45};
        // colors['lcoff'] = {id: 'l.coff', name: 'L.COFF', color: '#000000', backgroundcolor: '#ffffff', order: 46};
        // colors['lam'] = {id: 'lam', name: 'LAM', color: '#000000', backgroundcolor: '#ffffff', order: 47};
        // colors['lbn'] = {id: 'lbn', name: 'LBN', color: '#000000', backgroundcolor: '#ffffff', order: 48};
        // colors['lbr'] = {id: 'lbr', name: 'LBR', color: '#000000', backgroundcolor: '#ffffff', order: 49};
        // colors['lcf'] = {id: 'lcf', name: 'LCF', color: '#000000', backgroundcolor: '#ffffff', order: 50};
        // colors['lime'] = {id: 'lime', name: 'LIME', color: '#000000', backgroundcolor: '#ffffff', order: 51};
        // colors['mix'] = {id: 'mix', name: 'MIX', color: '#000000', backgroundcolor: '#ffffff', order: 52};
        // colors['mrn'] = {id: 'mrn', name: 'MRN', color: '#000000', backgroundcolor: '#ffffff', order: 53};
        // colors['mud'] = {id: 'mud', name: 'MUD', color: '#000000', backgroundcolor: '#ffffff', order: 54};
        // colors['na'] = {id: 'na', name: 'NA', color: '#000000', backgroundcolor: '#ffffff', order: 55};
        // colors['navy'] = {id: 'navy', name: 'NAVY', color: '#000000', backgroundcolor: '#ffffff', order: 56};
        // colors['nvy'] = {id: 'nvy', name: 'NVY', color: '#000000', backgroundcolor: '#ffffff', order: 57};
        // colors['oblk'] = {id: 'o.blk', name: 'O.BLK', color: '#000000', backgroundcolor: '#ffffff', order: 58};
        // colors['obk'] = {id: 'obk', name: 'OBK', color: '#000000', backgroundcolor: '#ffffff', order: 59};
        // colors['org'] = {id: 'org', name: 'ORG', color: '#000000', backgroundcolor: '#ffffff', order: 60};
        // colors['ph'] = {id: 'ph', name: 'PH', color: '#000000', backgroundcolor: '#ffffff', order: 61};
        // colors['pink'] = {id: 'pink', name: 'PINK', color: '#000000', backgroundcolor: '#ffffff', order: 62};
        // colors['pnk'] = {id: 'pnk', name: 'PNK', color: '#000000', backgroundcolor: '#ffffff', order: 63};
        // colors['pp'] = {id: 'pp', name: 'PP', color: '#000000', backgroundcolor: '#ffffff', order: 64};
        // colors['pur'] = {id: 'pur', name: 'PUR', color: '#000000', backgroundcolor: '#ffffff', order: 65};
        // colors['red'] = {id: 'red', name: 'RED', color: '#000000', backgroundcolor: '#ffffff', order: 66};
        // colors['sblu'] = {id: 's.blu', name: 'S.BLU', color: '#000000', backgroundcolor: '#ffffff', order: 67};
        // colors['sand'] = {id: 'sand', name: 'SAND', color: '#000000', backgroundcolor: '#ffffff', order: 68};
        // colors['slv'] = {id: 'slv', name: 'SLV', color: '#000000', backgroundcolor: '#ffffff', order: 69};
        // colors['tan'] = {id: 'tan', name: 'TAN', color: '#000000', backgroundcolor: '#ffffff', order: 70};
        // colors['wbn'] = {id: 'wbn', name: 'WBN', color: '#000000', backgroundcolor: '#ffffff', order: 71};
        // colors['wbr'] = {id: 'wbr', name: 'WBR', color: '#000000', backgroundcolor: '#ffffff', order: 72};
        // colors['whi'] = {id: 'whi', name: 'WHI', color: '#000000', backgroundcolor: '#ffffff', order: 73};
        // colors['whisky'] = {id: 'whisky', name: 'WHISKY', color: '#000000', backgroundcolor: '#ffffff', order: 74};
        // colors['wht'] = {id: 'wht', name: 'WHT', color: '#000000', backgroundcolor: '#ffffff', order: 75};
        // colors['wky'] = {id: 'wky', name: 'WKY', color: '#000000', backgroundcolor: '#ffffff', order: 76};
        // colors['wrd'] = {id: 'wrd', name: 'WRD', color: '#000000', backgroundcolor: '#ffffff', order: 77};
        // colors['ylw'] = {id: 'ylw', name: 'YLW', color: '#000000', backgroundcolor: '#ffffff', order: 78};

        // colors.$save();

        // sizes['38'] = {id: '38', name: '38', order: 1};
        // sizes['39'] = {id: '39', name: '39', order: 2};
        // sizes['40'] = {id: '40', name: '40', order: 3};
        // sizes['41'] = {id: '41', name: '41', order: 4};
        // sizes['42'] = {id: '42', name: '42', order: 5};
        // sizes['43'] = {id: '43', name: '43', order: 6};
        // sizes['44'] = {id: '44', name: '44', order: 7};
        // sizes['45'] = {id: '45', name: '45', order: 8};
        // sizes.$save();
    }

    return {
        online: function(){
            //Logging.log2FB($scope.user_detail.email, "starts online function in Codes.js service");
            // Mok Firebase SDK upgrade
            var config = {
                apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                authDomain: "fiery-heat-6039.firebaseapp.com",
                databaseURL: "https://fiery-heat-6039.firebaseio.com"
            };
            
            if (!firebase.apps.length){
                firebase.initializeApp(config);
            }    
            // Mok Firebase SDK upgrade              

            console.log("Codes online started");
            var fBrands = firebase.database().ref("codes/brands");            
            fBrands.on("value", function(snapshot) {
                localStorage.setItem('brg_brands', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            }); 
            brands = $firebaseObject(fBrands);
            brands_array = $firebaseArray(fBrands);
            
            var fColors = firebase.database().ref("codes/colors");
            fColors.on("value", function(snapshot) {
                localStorage.setItem('brg_colors', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            }); 
            colors = $firebaseObject(fColors);
            colors_array = $firebaseArray(fColors);
            
            var fSizes = firebase.database().ref("codes/sizes");
            fSizes.on("value", function(snapshot) {
                localStorage.setItem('brg_sizes', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            }); 
            sizes = $firebaseObject(fSizes);
            sizes_array = $firebaseArray(fSizes);
            
            var fPromos = firebase.database().ref("codes/promos");
            fPromos.on("value", function(snapshot) {
                localStorage.setItem('brg_promos', JSON.stringify(snapshot.val()));
            }, function (errorObject) {
                console.log("BRG Debug: The read failed: " + errorObject.code);
                if(errorObject.code === "PERMISSION_DENIED"){
                  $state.go('login');
                }
            }); 
            promos = $firebaseObject(fPromos);
            promos_array = $firebaseArray(fPromos);

            //createInitialData();
            is_online = true;
            //Logging.log2FB($scope.user_detail.email, "ends online function in Codes.js service");
        },

        offline: function(){
            //Logging.log2FB($scope.user_detail.email, "starts offline function in Codes.js service");
            brands = JSON.parse(localStorage.getItem('brg_brands'));
            brands_array = Object.keys(brands).map(function(key) { return brands[key] });
            colors = JSON.parse(localStorage.getItem('brg_colors'));
            colors_array = Object.keys(colors).map(function(key) { return colors[key] });
            sizes = JSON.parse(localStorage.getItem('brg_sizes'));
            sizes_array = Object.keys(sizes).map(function(key) { return sizes[key] });
            promos = JSON.parse(localStorage.getItem('brg_promos'));
            promos_array = Object.keys(promos).map(function(key) { return promos[key] });

            is_online = false;
            //Logging.log2FB($scope.user_detail.email, "ends offline function in Codes.js service");
        },


        get_brands: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_brands function in Codes.js service");
            return brands;
        },

        get_brands_as_array: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_brands_as_array function in Codes.js service");
            return brands_array;
        },

        get_colors: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_colors function in Codes.js service");
            return colors;
        },

        get_colors_as_array: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_colors_as_array function in Codes.js service");
            return colors_array;
        },

        get_sizes: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_sizes function in Codes.js service");
            return sizes;
        },

        get_sizes_as_array: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_sizes_as_array function in Codes.js service");
            return sizes_array;
        },

        get_promos: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_promos function in Codes.js service");
            return promos;
        },

        get_promos_as_array: function(){
            //Logging.log2FB($scope.user_detail.email, "starts get_promos_as_array function in Codes.js service");
            return promos_array;
        },

        remove: function(type, code){
            //Logging.log2FB($scope.user_detail.email, "starts remove function in Codes.js service");
            // Mok Firebase SDK upgrade
            var config = {
                apiKey: "AIzaSyBy7hOHXlbrF-TkCBE8DxdG_y-KFfJqm0c",
                authDomain: "fiery-heat-6039.firebaseapp.com",
                databaseURL: "https://fiery-heat-6039.firebaseio.com"
            };
                        
            // Mok Firebase SDK upgrade  
            if(is_online){
                if (!firebase.apps.length){                
                    firebase.initializeApp(config);                
                }    
                if(type == "sizes"){                    
                    var fCodes = firebase.database().ref("codes/" + type + "/" + code);
                }else{                    
                    var fCodes = firebase.database().ref("codes/" + type + "/" + code.toLowerCase());
                }
                var code = $firebaseObject(fCodes);
                code.$remove().then(function(fCodes){
                        console.log("Data removed from server");
                    }, function(error) {
                        console.log("Error:", error);
                    });
            }
            else{
                if(type == "brands"){
                    delete brands[code];
                }
                if(type == "colors"){
                    delete colors[code];
                }
                if(type == "sizes"){
                    delete sizes[code];
                }
                if(type == "promos"){
                    delete promos[code];
                }

            }
            //Logging.log2FB($scope.user_detail.email, "ends remove function in Codes.js service");
        },

        add: function(type, code){
            //Logging.log2FB($scope.user_detail.email, "starts add function in Codes.js service");

            var code_id = code.name.toLowerCase();
            if(code_id.indexOf(".") > -1){
                code_id = code_id.replace(".","_");
            }
            if(is_online){
                if(type == "brands"){
                    brands[code_id] = new Object();
                    brands[code_id].id = code.name.toLowerCase();
                    brands[code_id].name = code.name.toUpperCase();
                    brands[code_id].target = code.target;
                    brands.$save();
                }
                if(type == "colors"){
                    if(code.commoncolor){
                        code_id = "1"+code.name.toLowerCase();
                        colors[code_id] = new Object();
                        colors[code_id].id = "1"+code.name.toLowerCase();
                        colors[code_id].name = code.name.toUpperCase();
                        colors[code_id].group = "common color"
                        colors.$save();
                    }else{
                    colors[code_id] = new Object();
                    colors[code_id].id = code.name.toLowerCase();
                    colors[code_id].name = code.name.toUpperCase();
                    colors.$save();
                    }
                }
                if(type == "sizes"){
                    sizes[code_id] = new Object();
                    sizes[code_id].id = code.name.toLowerCase();
                    sizes[code_id].name = code.name.toUpperCase();
                    sizes.$save();
                }
                if(type == "promos"){
                    promos[code_id] = new Object();
                    promos[code_id].desc = code.desc.toUpperCase();
                    promos[code_id].id = code.name.toLowerCase();
                    promos[code_id].name = code.name.toUpperCase();
                    promos[code_id].promo_discount = code.promo_discount;
                    promos[code_id].promo_sale_price = code.promo_sale_price;
                    promos.$save();
                }
            }else{
                if(type == "brands"){
                    brands[code_id] = new Object();
                    brands[code_id].id = code.name.toLowerCase();
                    brands[code_id].name = code.name.toUpperCase();
                    brands[code_id].target = code.target;
                }
                if(type == "colors"){
                    if(code.commoncolor){
                        code_id = "1"+code.name.toLowerCase();
                        colors[code_id] = new Object();
                        colors[code_id].id = "1"+code.name.toLowerCase();
                        colors[code_id].name = code.name.toUpperCase();
                        colors[code_id].group = "common color"
                        colors.$save();
                    }else{
                    colors[code_id] = new Object();
                    colors[code_id].id = code.name.toLowerCase();
                    colors[code_id].name = code.name.toUpperCase();
                    colors.$save();
                    }
                }
                if(type == "sizes"){
                    sizes[code] = new Object();
                    sizes[code_id].id = code.name.toLowerCase();
                    sizes[code_id].name = code.name.toUpperCase();
                }
                if(type == "promos"){
                    promos[code] = new Object();
                    promos[code_id].desc = code.desc.toUpperCase();
                    promos[code_id].id = code.name.toLowerCase();
                    promos[code_id].name = code.name.toUpperCase();
                    promos[code_id].promo_discount = code.promo_discount;
                    promos[code_id].promo_sale_price = code.promo_sale_price;
                }
            }
            //Logging.log2FB($scope.user_detail.email, "ends add function in Codes.js service");
        }
    }
}]);
