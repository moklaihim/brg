angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "Env", "Logging", function($scope, Env, Logging) {
    console.log("ReportListController started");
    Logging.log2FB($scope.user_detail.email, "ReportListController started");
    //if(Env.isMobile()){
    //  $cordovaGoogleAnalytics.trackView('ReportListController');
    //}
    $scope.current.view = 'reports_list';
}])
