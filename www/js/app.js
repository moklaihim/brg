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

  $ionicPlatform.registerBackButtonAction(function (event) {
                    event.preventDefault();
            }, 100);
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

  // Each tab has its own nav history stack:

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

  .state('tab.stock', {
      url: '/stock',
      views: {
        'tab-stock': {
          templateUrl: 'templates/tab-stock.html',
          controller: 'StockCtrl'
        }
      }
    })

  .state('tab.sales', {
      url: '/sales',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sales.html',
          controller: 'SalesCtrl'
         }
       }
    })

  .state('tab.sale-list', {
      url: '/sale_list',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sale_list.html',
          controller: 'SaleListController'
         }
       }
    })

  .state('tab.sale-add', {
      url: '/sale_add',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sale_add.html',
          controller: 'SaleAddController'
         }
       }
    })

  .state('tab.sales-m1', {
      url: '/sales/m1',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sales-m1.html',
          controller: 'SalesCtrl'
         }
       }
    })

  .state('tab.sales-m2', {
      url: '/sales/m2',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sales-m2.html',
          controller: 'SalesCtrl'
         }
       }
    })

  .state('tab.sales-additem', {
      url: '/sales/additem',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sales-additem.html',
          controller: 'SalesCtrl'
         }
       }
    })

  .state('tab.sales-stores', {
      url: '/sales/stores',
       views: {
         'tab-sales': {
          templateUrl: 'templates/tab-sales-stores.html',
          controller: 'SalesCtrl'
         }
       }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/sale_add');
});

