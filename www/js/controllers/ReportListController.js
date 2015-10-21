angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "$cordovaGoogleAnalytics", "Env", function($scope, $cordovaGoogleAnalytics, Env) {
    console.log("ReportListController started");
    if(Env.isMobile()){
      $cordovaGoogleAnalytics.trackView('ReportListController');
    }
    $scope.current.view = 'reports_list';
}])
