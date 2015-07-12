angular.module('starter.controllers')
.controller('ReportViewController', ["$scope", "$stateParams", "Stores", "Sales", "Items", "items", "Env", "$cordovaEmailComposer", function($scope, $stateParams, Stores, Sales, Items, items, Env, $cordovaEmailComposer) {
    console.log("ReportViewController started");
    $scope.current.view = 'reports_list';

    $scope.stores = Stores.get_list();
    $scope.report_type = $stateParams.reportType;
    updateReport();

    function updateReport(){
        console.log("start update report");

        $scope.sales4stores = new Object();
        $scope.total4stores = new Object();
        $scope.grandtotal = 0;

        console.log($scope.stores);
        angular.forEach($scope.stores, function(value, key) {
            $scope.total4stores[key] = 0;
            var p_sales = Sales.get(key, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            // if(!p_sales.hasOwnProperty(sale.item)){
            //     $scope.noSales = true;
            // }
            p_sales.then(function(sales_detail){
                $scope.sales4stores[key] = sales_detail;
                console.log(key);
                console.log(sales_detail);
                angular.forEach($scope.sales4stores[key], function(sale, i) {
                    if(sale.item != "CLOSED"){
                        var count_target = false;
                        console.log(sale.item);
                        if($stateParams.reportType == "mens"){
                            if(sale.item.indexOf("B") === 0 || sale.item.indexOf("HB") === 0 || sale.item.indexOf("R") === 0 || sale.item.indexOf("S") === 0){
                                console.log("This is mens");
                                //B, HB, R, S
                                count_target = true;
                            }else{
                                console.log("This is not mens");
                            }
                        }else{
                            if(sale.item.indexOf("F") === 0 || sale.item.indexOf("H") === 0){
                                //F, H
                                count_target = true;
                            }
                        }
                        if(count_target){
                            $scope.sales4stores[key][i].retail_price = items[sale.item].retail_price;
                            // $scope.sales4stores[key][i].discount_rate = 100 - Math.round(sale.price / items[sale.item].retail_price * 1000) / 10;
                            $scope.sales4stores[key][i].discount_rate = sale.discount;
                            $scope.total4stores[key] += sale.price * 1;
                            $scope.grandtotal += sale.price * 1;
                        }else{
                            delete $scope.sales4stores[key][i];
                        }
                        console.log($scope.total4stores[key]);
                        console.log($scope.grandtotal);
                    }
                });
            });
        });
    }

    $scope.send = function(){
        var tos = user.reportSendTo;
        var ccs = user.reportSendCc;
        var subject = $scope.report_type.toUpperCase() + ' Daily report for ' + $scope.current.set_date;
        var emailbody = $scope.report_type.toUpperCase() + ' Daily report for ' + $scope.current.set_date + "\n\n";
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
            window.location.href = "mailto:" + tos + "?cc=" + ccs + "&subject=" + subject + "&body=" + encodeURIComponent(emailbody);
        }
    };

    $scope.$on('changedDate', updateReport);

    /*
    var online_watch = $scope.$watch(Env.isOnline, function(val){
        console.log("isOnline changed");
        if(val == true){
            items = Items.get();
            updateReport();
            online_watch();
        }
    }, false);
    */

}])
