// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.services', 'firebase', 'ngAnimate', 'ngCordova', 'datePicker', 'ngIOS9UIWebViewPatch'])
.run(["$ionicPlatform", "$rootScope", "$state", "Env", function($ionicPlatform, $rootScope, $state, Env) {
    $ionicPlatform.ready(function() {

      //if(Env.isMobile()){
      //  $cordovaGoogleAnalytics.debugMode();
      //  $cordovaGoogleAnalytics.startTrackerWithId('UA-69092505-1');
      //}
        
        console.log("BRG Debug: run start");

        //$ionicAnalytics.register();

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });

    //$rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log("stateChangeError occured");
        console.log(event);
        console.log(toState);
        console.log(toParams);
        console.log(fromState);
        console.log(fromParams);
        console.log("ERROR -- ", error);
        if (error === "AUTH_REQUIRED") {
          console.log("error is AUTH_REQUIRED");
          $state.go('login');
        }
    });
}])

.directive("ink", ['ionicMaterialInk', function(ionicMaterialInk) {
    return {
        restrict: "A",
        link: function () {
                ionicMaterialInk.displayEffect();
        }
    };
}])

.factory('$exceptionHandler', ['$injector', function($injector) {
    var loggingService;
    var email;
    //var ;
    return function(exception, cause) {
        loggingService = loggingService || $injector.get('loggingService');
        exception.message += ' (caused by "' + cause + '" File: ' + exception.fileName + ' Line: ' + exception.lineNumber + ')' ;
        if(window.localStorage.getItem('brg_login_email') !== null){
          email = window.localStorage.getItem('brg_login_email');
        }else{
          email = "unknown";
        }
        loggingService.log2FB(email, exception.message);
        setTimeout(function() {
          throw exception;
        }, 0);
    };
}])

.filter('itemFilter', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, filterKey, filterType) {

    var output = new Array();
        if(filterKey){
            // console.log("filter is not S");
            if(filterType == 'brand'){
                regexp = new RegExp('^' + filterKey);
            }else if(filterType == 'color'){
                regexp = new RegExp('-' + filterKey);
            }else if(filterType == 'size'){
                regexp = new RegExp(filterKey + '$');
            }else if(filterType == 'code'){
                regexp = new RegExp(filterKey);
            }
        

            for (var i = 0; i < input.length; i++) {
                if (regexp.test(input[i].id)){
                    output.push(input[i]);
                }
            }
        }else{
            output = input;
        }

    // Do filter work here

    return output;

  }

})

.filter('startsWith', function () {
    return function (input, filterLetters) {
        var output = [];
        if(filterLetters == "COM"){
            console.log("item COM selected")
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/^1/i.test(item.id)) {
                    // console.log("item COM selected");
                    output.push(item);
                }
                // if (/^BRN/i.test(item.id)) {
                //     // console.log("item COM selected");
                //     output.push(item);
                // }
                // if (/^TAN/i.test(item.id)) {
                //     // console.log("item COM selected");
                //     output.push(item);
                // }
            }
        }
        else if(filterLetters == "ABC"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/a/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/b/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/c/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "DEF"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/d/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/e/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/f/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "GHI"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/g/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/h/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/i/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "JKL"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/j/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/k/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/l/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "MNO"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/m/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/n/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/o/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "PQR"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/p/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/q/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/r/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "STU"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/s/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/t/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/u/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "VWX"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/v/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/w/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/x/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else if(filterLetters == "YZ"){
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                if (/y/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
                if (/z/i.test(item.id.substring(0, 1))) {
                    output.push(item);
                }
            }
        }
        else{
            output = input;
        }
        
        return output;
    }
})

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Identify app
    //$ionicAppProvider.identify({
        // The App ID (from apps.ionic.io) for the server
        //app_id: '6847b83e',
        // The public API key all services will use for this app
        //api_key: '1cf107f10ef4988c40b4f205c3db288e2398c56a2f2dfdac'
        // Set the app to use development pushes
        //dev_push: true,
        //gcm_id: '622335018092'
    //});

    $ionicConfigProvider.tabs.position("top");
    $ionicConfigProvider.tabs.style("striped");
    $ionicConfigProvider.navBar.alignTitle('left');
    $ionicConfigProvider.views.forwardCache(true);

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.icon('mdi mdi-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText(false);

    $ionicConfigProvider.scrolling.jsScrolling(true);
  
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginController',
    })

    .state('main', {
        url: "/main",
        abstract: true,
        templateUrl: 'templates/main.html',
        cache: false,
        controller: 'MainController',
        resolve: {
            "currentAuth": ["Auth", "$state", function(Auth, $state) {
                console.log("BRG Debug: currentAuth started");
                return Auth.getAuth().$requireSignIn()
                    .then(function(data){
                        return data;
                    }, function(){
                        $state.go('login');
                    });
            }],
            "user": ["currentAuth", "Users", function(currentAuth, Users){
                console.log("BRG Debug: user started");
                console.log("currentAuth: ", currentAuth);
                //return Users.get_one(currentAuth.password.email, "email");
                return Users.get_one(currentAuth.email, "email");
            }],
            "role": ["Roles", "user", function(Roles, user){
                console.log("BRG Debug: user started");
                return Roles.get_one(user.role);
            }]
        }
    })

    .state('main.sales_list', {
        url: '/sales/list',
        cache: false,
        templateUrl: 'templates/tab-sale_list.html',
        controller: 'SaleListController'
    })

    .state('main.sales_add', {
        url: '/sales/add',
        cache: false,
        templateUrl: 'templates/tab-sale_add.html',
        controller: 'SaleAddController'
    })

    .state('main.items_list', {
        url: '/items/list',
        cache: false,
        templateUrl: 'templates/tab-item_list.html',
        controller: 'ItemListController'
    })

    .state('main.items_add', {
        url: '/items/add',
        cache: false,
        templateUrl: 'templates/tab-item_add.html',
        controller: 'ItemAddController'
    })

    .state('main.sales_scanadd', {
        url: '/sales/scanadd',
        cache: false,
        templateUrl: 'templates/tab-item_list.html',
        controller: 'ItemListController'
    })

    .state('main.stores_list', {
        url: '/stores/list',
        cache: false,
        templateUrl: 'templates/tab-store_list.html',
        controller: 'StoreListController'
    })

    .state('main.reports_list', {
        url: '/reports/list',
        cache: false,
        templateUrl: 'templates/report_list.html',
        controller: 'ReportListController'
    })

    .state('main.report_view', {
        url: '/reports/view/:reportType',
        cache: false,
        templateUrl: 'templates/report_view.html',
        controller: 'ReportViewController',
        resolve: {
            "items": ["Items", function(Items) {
                return Items.get();
            }]
        }
    })

    .state('main.codes_list', {
        url: '/codes/list',
        cache: false,
        templateUrl: 'templates/code_list.html',
        controller: 'CodeListController'
    })

    .state('main.users_list', {
        url: '/users/list',
        cache: false,
        templateUrl: 'templates/user_list.html',
        controller: 'UserListController',
        resolve: {
            "users": ["Users", function(Users) {
                return Users.get_list();
            }],
            "roles": ["Roles", function(Roles) {
                return Roles.get_list();
            }]
        }
    })

    .state('main.users_add', {
        url: '/users/add',
        cache: false,
        templateUrl: 'templates/user_edit.html',
        controller: 'UserEditController'
    })

    .state('main.users_edit', {
        url: '/users/edit',
        cache: false,
        templateUrl: 'templates/user_edit.html',
        controller: 'UserEditController'
    })

    .state('main.roles_list', {
        url: '/roles/list',
        cache: false,
        templateUrl: 'templates/role_list.html',
        controller: 'RoleListController',
        resolve: {
            "roles": ["Roles", function(Roles) {
                return Roles.get_list();
            }]
        }
    })

    .state('main.settings', {
        url: '/settings',
        cache: false,
        templateUrl: 'templates/settings.html',
        controller: 'SettingsController'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main/sales/list');
    
}]);

