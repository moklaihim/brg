angular.module('starter.controllers')
.controller('ReportListController', ["$scope", "Stores", "Sales", "Env", "Items", "items", "Env", "$cordovaEmailComposer", function($scope, Stores, Sales, Env, Items, items, Env, $cordovaEmailComposer) {
    console.log("ReportListController started");
    $scope.current.view = 'reports_list';

    $scope.stores = Stores.get_list();
    updateReport();

    function updateReport(){
        $scope.sales4stores = new Object();
        $scope.total4stores = new Object();
        $scope.grandtotal = 0;

        angular.forEach($scope.stores, function(value, key) {
            $scope.sales4stores[key] = Sales.get(key, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            $scope.total4stores[key] = 0;
            if($scope.sales4stores[key].$loaded){
                $scope.sales4stores[key].$loaded().then(function() {
                    angular.forEach($scope.sales4stores[key], function(sale, i) {
                        if(sale.item != "CLOSED"){
                            $scope.sales4stores[key][i].retail_price = items[sale.item].retail_price;
                            $scope.sales4stores[key][i].discount_rate = 100 - Math.round(sale.price / items[sale.item].retail_price * 1000) / 10;
                            $scope.total4stores[key] += sale.price * 1;
                            $scope.grandtotal += sale.price * 1;
                        }
                    });
                });
            }
        });
    }

    $scope.send = function(){
        var tos = 'tom.tomonari@gmail.com';
        var subject = 'Daily report for ' + $scope.current.set_date;
        var emailbody = 'Daily report for ' + $scope.current.set_date + "\n\n";
        angular.forEach($scope.stores, function(value, key) {
            emailbody += $scope.stores[key].name;
            if(!$scope.sales4stores[key].CLOSED){
                emailbody += " ( SALES NOT CLOSED )";
            }
            emailbody += "\n";
            angular.forEach($scope.sales4stores[key], function(sale, i) {
                if(sale.item != "CLOSED"){
                    emailbody += sale.item  + " $" + sale.retail_price + " * " + sale.discount_rate + "% = $" + sale.price + "\n";
                }
            });
            emailbody += "------------------------\n";
            emailbody += "Total: $" + $scope.total4stores[key] + "\n\n";
        });
        emailbody += "------------------------\n";
        emailbody += "Grand total: $" + $scope.grandtotal + "\n";

        if(Env.isMobile()){
            $cordovaEmailComposer.isAvailable().then(function() {
                // is available
                var email = {
                    to: tos,
                    subject: subject,
                    body: emailbody,
                    isHtml: false
                };

                $cordovaEmailComposer.open(email).then(null, function () {
                    // user cancelled email
                });

            }, function () {
                // not available
            });
        }else{
            window.location.href = "mailto:" + tos + "?subject=" + subject + "&body=" + encodeURIComponent(emailbody);
        }
    };

    $scope.$on('changedDate', updateReport);

    var online_watch = $scope.$watch(Env.isOnline, function(val){
        console.log("isOnline changed");
        if(val == true){
            items = Items.get();
            updateReport();
            online_watch();
        }
    }, false);

}])
