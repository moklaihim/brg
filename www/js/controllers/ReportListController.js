angular.module('starter.controllers')
.controller('ReportListController', ["$scope", function($scope) {
    console.log("ReportListController started");
    $scope.current.view = 'reports_list';
}])
