angular.module('starter.controllers')
.controller('ReportViewController', ["$scope", "$stateParams", "Codes", "Stores", "Sales", "Env", "items", "$cordovaEmailComposer", function($scope, $stateParams, Codes, Stores, Sales, Env, items, $cordovaEmailComposer) {
    console.log("ReportViewController started");
    $scope.current.view = 'reports_list';

    $scope.stores = Stores.get_list();
    $scope.report_type = $stateParams.reportType;
    updateReport();
    var brands = Codes.get_brands();

    function updateReport(){
        console.log("start update report");

        $scope.sales4stores = new Object();
        $scope.total4stores = new Object();
        $scope.grandtotal = 0;

        console.log($scope.stores);
        angular.forEach($scope.stores, function(value, key) {
            $scope.total4stores[key] = 0;
            var p_sales = Sales.get(key, $scope.current.set_year, $scope.current.set_month, $scope.current.set_day);
            p_sales.then(function(sales_detail){
                $scope.sales4stores[key] = sales_detail;
                console.log(key);
                console.log(sales_detail);
                angular.forEach($scope.sales4stores[key], function(sale, i) {
                    if(sale.item != "CLOSED"){
                        var count_target = false;
                        console.log(sale.item);

                        //take brand name
                        var brand = sale.item.slice(0, sale.item.search(/\d/));
                        console.log(brands[brand.toLowerCase()].target);
                        if(brands[brand.toLowerCase()].target == $stateParams.reportType){
                          count_target = true;
                        }

                        if(count_target){
                            //I think below 2 lines can be adjusted and deleted. Tom
                            //$scope.sales4stores[key][i].retail_price = items[sale.item].retail_price;
                            //$scope.sales4stores[key][i].discount_rate = sale.discount;
                            $scope.total4stores[key] += sale.price * 1;
                            $scope.grandtotal += sale.price * 1;
                        }else{
                            delete $scope.sales4stores[key][i];
                        }
                        console.log($scope.total4stores[key]);
                        console.log($scope.grandtotal);
                        $scope.total4stores[key] = Math.floor($scope.total4stores[key] * 100)/100;
                    }
                });
                $scope.grandtotal = Math.floor($scope.grandtotal * 100)/100;
            });
        });
    }

    $scope.send = function(){
        var tos = $scope.user_detail.reportTo;
        var ccs = $scope.user_detail.reportCc;
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
                    subject: subject,
                    body: emailbody,
                    isHtml: false
                };
                if(tos && tos.length > 4){
                  email.to = tos.split(",");
                }
                if(ccs && tos.length > 4){
                  email.cc = ccs.split(",");
                }

                $cordovaEmailComposer.open(email).then(null, function () {
                    // user cancelled email
                });

            }, function () {
                // not available
            });
        }else{
            tos = tos.replace(" ","");
            window.location.href = "mailto:" + tos + "?cc=" + ccs + "&subject=" + subject + "&body=" + encodeURIComponent(emailbody);
        }
    };

    $scope.$on('changedDate', updateReport);
}])
