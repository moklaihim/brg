// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
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

  // $ionicPlatform.registerBackButtonAction(function (event) {
  //                   event.preventDefault();
  //           }, 100);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle('left');
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.user', {
      url: '/user',
      views: {
        'tab-user': {
          templateUrl: 'templates/tab-user.html',
          controller: 'UserCtrl'
        }
      }
    })

  .state('main', {
    url: "/main",
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'MainController'
  })

  .state('main.sales_list', {
      url: '/sales/list',
      cache: false,
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sale_list.html',
          controller: 'SaleListController'
         }
       }
    })

  .state('main.sales_add', {
      url: '/sales/add',
      cache: false,
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sale_add.html',
          controller: 'SaleAddController'
         }
       }
    })

  .state('main.items_add', {
      url: '/items/add',
      cache: false,
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-item_add.html',
          controller: 'ItemAddController'
         }
       }
    })

  .state('main.stores_list', {
      url: '/stores/list',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-store_list.html',
          controller: 'StoreListController'
         }
       }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/sales/list');
});

