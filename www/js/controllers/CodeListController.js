angular.module('starter.controllers')
.controller('CodeListController', ["$scope", "$state", "$filter", "$ionicPopup", "Codes", function($scope, $state, $filter, $ionicPopup, Codes) {
    console.log("CodeListController started");
    $scope.current.view = 'codes_list';

    $scope.code = {
        brandCode : '',
        colorCode : '',
        sizeCode : ''
    };

    $scope.$watch('code.brandCode', function(val) {
        $scope.code.brandCode = $filter('uppercase')(val);
    }, false);
    $scope.$watch('code.colorCode', function(val) {
        $scope.code.colorCode = $filter('uppercase')(val);
    }, false);

    function submitCode(event){
        var type = event.target.id;

        if(type == "brands"){
            if(!$scope.code.brandCode){
                $scope.showAlert("Alert", "Please enter a value");
            }else{
                var codes = Codes.get_brands_as_array();
                var inputCode = $scope.code.brandCode;
            }
        }
        if(type == "colors"){
            if(!$scope.code.colorCode){
                $scope.showAlert("Alert", "Please enter a value");
            }else{
                var codes = Codes.get_colors_as_array();
                var inputCode = $scope.code.colorCode;
            }
        }
        if(type == "sizes"){
            if(!$scope.code.sizeCode){
                $scope.showAlert("Alert", "Please enter a value");
            }else{
                var codes = Codes.get_sizes_as_array();
                var inputCode = $scope.code.sizeCode;
            }
        }

        for (var i = 0; i < codes.length; i++) {
            if(codes[i].name == inputCode){
                console.log("item found :" + inputCode)
                var sameCodeFound = true;
            }
        }
        if(sameCodeFound){
            alertExist(type,inputCode);
            $scope.code.brandCode = '';
            $scope.code.colorCode = '';
            $scope.code.sizeCode = '';
        }
        else{
            if(type == "sizes"){
                Codes.add(inputCode, type);
                $scope.showAlert("Alert", 'Code "' + inputCode + '" is added to the '+ type + ' database');
                $scope.code.sizeCode = '';
            }else{
                Codes.add(inputCode.toLowerCase(), type);
                $scope.showAlert("Alert", 'Code "' + inputCode + '" is added to the '+ type + ' database');
                $scope.code.brandCode = '';
                $scope.code.colorCode = '';
                
            }
        }
    }
    $scope.submitCode = submitCode;

    function alertExist(type, inputCode){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Code Exist',
         template: 'This Code "' + inputCode + '" exist in the '+ type + ' database, do you want to delete?',
         okType: 'button-flat',
         cancelType: 'button-flat'
       });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
                Codes.remove(inputCode,type);
            } else {
                console.log('You are not sure');
            }
        });
    };
}])
