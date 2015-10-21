angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "Env", function($scope, Env) {
    console.log("ReportListController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('ReportListController');
    //}
    $scope.current.view = 'reports_list';
}])
