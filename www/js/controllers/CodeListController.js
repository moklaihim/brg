angular.module('starter.controllers')
.controller('CodeListController', ["$scope", "$state", "$filter", "$ionicPopup", "Codes", function($scope, $state, $filter, $ionicPopup, Codes) {
    console.log("CodeListController started");
    $scope.current.view = 'codes_list';

    $scope.brands = Codes.get_brands();
    $scope.colors = Codes.get_colors();
    $scope.sizes = Codes.get_sizes();

    $scope.editCode = function(type, code_id) {
      $scope.code = {};
      if(code_id){
        $scope.code = $scope[type][code_id];
      }

      var template = {
        'brands': '<div class="list">' + 
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Brand initial</span><input type="text" placeholder="Brand initial" ng-model="code.name">' + 
          '</label>' + 
          '<label class="item item-input item-stacked-label">' +
          '<span class="input-label">Target</span><select ng-model="code.target"><option value="mens" ng-selected=\'code.target == "mens"\' >Mens</option><option value="ladies" ng-selected=\'code.target == "ladies"\' >Ladies</option></select>' +
          '</label>' +
          '</div>',
        'colors': '<div class="list">' +
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Color initial</span><input type="text" placeholder="Color initial" ng-model="code.name">' + 
          '</label>' + 
          '</div>',
        'sizes': '<div class="list">' +
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Size</span><input type="text" placeholder="Size" ng-model="code.name">' + 
          '</label>' + 
          '</div>'
      };

      // An elaborate, custom popup
      var editCodePopup = $ionicPopup.show({
        title: 'Edit ' + type,
        //subTitle: 'Please edit brand data',
/*
        template: ' <div class="list">' + 
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Brand initial</span><input type="text" placeholder="Brand initial" ng-model="code.name">' + 
          '</label>' + 
          '<label class="item item-input item-stacked-label">' +
          '<span class="input-label">Target</span><select ng-model="code.target"><option value="mens" ng-selected=\'code.target == "mens"\' >Mens</option><option value="ladies" ng-selected=\'code.target == "ladies"\' >Ladies</option></select>' +
          '</label>' +
          '</div>',
*/
        template: template[type],
        scope: $scope,
        buttons: [
          {
            text: 'Cancel',
            type: 'button-flat'
           },

          {
            text: 'Save',
            type: 'button-flat',
            onTap: function(e) {
              if (!$scope.code.name) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                Codes.add(type, $scope.code);
                $scope.brands = Codes.get_brands();
                $scope.colors = Codes.get_colors();
                $scope.sizes = Codes.get_sizes();
                return;
              }
            }
          }
        ]
      });
    };

    $scope.removeCode = function(type, code_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Remove ' + type,
        template: 'Are you sure you want to remove?',
        okType: 'button-flat',
        cancelType: 'button-flat'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          Codes.remove(type, code_id);
          $scope.brands = Codes.get_brands();
          $scope.colors = Codes.get_colors();
          $scope.sizes = Codes.get_sizes();
        }
      });
    };

}])
