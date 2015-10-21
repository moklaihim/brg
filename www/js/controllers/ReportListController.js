angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "$cordovaGoogleAnalytics", function($scope, $cordovaGoogleAnalytics) {
    console.log("ReportListController started");
    $cordovaGoogleAnalytics.trackView('ReportListController');
    $scope.current.view = 'reports_list';
}])
