// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ngCordova', 'datePicker'])
.run(["$ionicPlatform", "$rootScope", "$state", function($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function() {
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

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error && !error.authenticated) {
            $state.go('login');
        }
    });

    // $ionicPlatform.registerBackButtonAction(function (event) {
    //                   event.preventDefault();
    //           }, 100);
}])

.filter('itemFilter', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input, filterKey, filterType) {

    var output = new Array();

    if(filterKey){

        if(filterType == 'brand'){
            regexp = new RegExp('^' + filterKey);
        }else if(filterType == 'color'){
            regexp = new RegExp('-' + filterKey + '-');
        }else if(filterType == 'size'){
            regexp = new RegExp('-' + filterKey + '$');
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.navBar.alignTitle('left');
    $ionicConfigProvider.views.forwardCache(true);
  
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
        controller: 'LoginController'
    })

    .state('main', {
        url: "/main",
        abstract: true,
        templateUrl: 'templates/main.html',
        cache: false,
        controller: 'MainController',
        resolve: {
            "currentAuth": ["Auth", function(Auth) {
                console.log("currentAuth started");
                return Auth.getAuth().$requireAuth();
            }]
        }
    })

    .state('main.sales_list', {
        url: '/sales/list',
        cache: false,
        templateUrl: 'templates/tab-sale_list.html',
        controller: 'SaleListController'
    })

    .state('main.items_list', {
        url: '/items/list',
        cache: false,
        templateUrl: 'templates/tab-item_list.html',
        controller: 'ItemListController'
    })

    .state('main.sales_add', {
        url: '/sales/add',
        cache: false,
        templateUrl: 'templates/tab-sale_add.html',
        controller: 'SaleAddController'
    })

    .state('main.sales_scanadd', {
        url: '/sales/scanadd',
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

    .state('main.stores_list', {
        url: '/stores/list',
        cache: false,
        templateUrl: 'templates/tab-store_list.html',
        controller: 'StoreListController'
    })

    .state('main.users_list', {
        url: '/users/list',
        cache: false,
        templateUrl: 'templates/user_list.html',
        controller: 'UserListController'
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
        controller: 'RoleListController'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main/sales/list');
});

