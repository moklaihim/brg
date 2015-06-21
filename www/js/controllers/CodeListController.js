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
    }, true);
    $scope.$watch('code.colorCode', function(val) {
        $scope.code.colorCode = $filter('uppercase')(val);
    }, true);

    function submitCode(event){
        var type = event.target.id;

        if(type == "brands"){
            if(!$scope.code.brandCode){
                alertRequireInput();
            }else{
                var codes = Codes.get_brands_as_array();
                var inputCode = $scope.code.brandCode;
            }
        }
        if(type == "colors"){
            if(!$scope.code.colorCode){
                alertRequireInput();
            }else{
                var codes = Codes.get_colors_as_array();
                var inputCode = $scope.code.colorCode;
            }
        }
        if(type == "sizes"){
            if(!$scope.code.sizeCode){
                alertRequireInput();
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
                alertAdded(type, inputCode);
                $scope.code.sizeCode = '';
            }else{
                Codes.add(inputCode.toLowerCase(), type);
                alertAdded(type, inputCode);
                $scope.code.brandCode = '';
                $scope.code.colorCode = '';
                
            }
        }
    }
    $scope.submitCode = submitCode;

    function alertRequireInput(){
        var alertPopup = $ionicPopup.alert({
         title: 'Error',
         template: 'Please enter a value'
        });
    };
    $scope.alertRequireInput = alertRequireInput;

    function alertAdded(type, inputCode){
        var alertPopup = $ionicPopup.alert({
         title: 'Code Added',
         template: 'Code "' + inputCode + '" is added to the '+ type + ' database'
        });
    };
    $scope.alertAdded = alertAdded;

    function alertExist(type, inputCode){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Code Exist',
         template: 'This Code "' + inputCode + '" exist in the '+ type + ' database, do you want to delete?'
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
    $scope.alertExist = alertExist;



}])
