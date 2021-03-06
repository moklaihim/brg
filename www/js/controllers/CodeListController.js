angular.module('starter.controllers')
.controller('CodeListController', ["$scope", "$state", "$filter", "$ionicPopup", "Codes", "Env", "Logging", function($scope, $state, $filter, $ionicPopup, Codes, Env, Logging) {
    console.log("CodeListController started");
    Logging.log2FB($scope.user_detail.email, "CodeListController started");
    //if(Env.isMobile()){
      //$cordovaGoogleAnalytics.trackView('CodeListController');
    //}
    $scope.current.view = 'codes_list';

    $scope.brands = Codes.get_brands();
    $scope.colors = Codes.get_colors();
    $scope.sizes = Codes.get_sizes();
    $scope.promos = Codes.get_promos();
    


    $scope.editCode = function(type, code_id) {
      Logging.log2FB($scope.user_detail.email, "starts editCode function in CodeListController");
      $scope.code = {};
      if(code_id){
        $scope.code = $scope[type][code_id];
      }

      $scope.code.promo_discount = "";
      $scope.code.promo_sale_price = "";
      $scope.code.commoncolor = false;

      var template = {
        'brands': '<div class="list">' + 
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Brand initial</span><input type="text" placeholder="Brand initial" ng-model="code.name">' + 
          '</label>' + 
          '<label class="item item-input item-stacked-label">' +
          '<span class="input-label">Target</span><select ng-model="code.target"><option value="men" ng-selected=\'code.target == "men"\' >Men</option><option value="ladies" ng-selected=\'code.target == "ladies"\' >Ladies</option></select>' +
          '</label>' +
          '</div>',
        'colors': '<div class="list">' +
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Color initial</span><input type="text" placeholder="Color initial" ng-model="code.name">' + 
          '</label>' + 
          '<div class="item item-checkbox">' +
          '<label class="checkbox">' +
          '<input type="checkbox" ng-model="code.commoncolor">' +
          '</label>' +
          'Add to common' +
          '</div>' +
          '</div>',
        'sizes': '<div class="list">' +
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Size</span><input type="text" placeholder="Size" ng-model="code.name">' + 
          '</label>' + 
          '</div>',
        'promos': '<div class="list">' +
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Promotion Code</span><input type="text" placeholder="Promotion Code" ng-model="code.name">' + 
          '</label>' + 
          '<label class="item item-input item-floating-label">' + 
          '<span class="input-label">Promotion Description</span><input type="text" placeholder="Promotion Description" ng-model="code.desc">' + 
          '</label>' + 
          '<label class="item item-input item-stacked-label">' +
          '<span class="input-label">Discount</span><input type="number" placeholder="Discount" ng-model="code.promo_discount" ng-change="changesale()">' +
          '</label>' +
          '<label class="item item-input item-stacked-label">' +
          '<span class="input-label">Sales Price</span><input type="number" placeholder="Sales Price" ng-model="code.promo_sale_price" ng-change="changediscount()">' +
          '</label>' +
          '</div>'
      };

    function changesale(){
      Logging.log2FB($scope.user_detail.email, "starts changesale function in CodeListController");
        if ($scope.code.promo_discount){
          $scope.code.promo_sale_price = "";
          console.log("sales had changed");
        }
        Logging.log2FB($scope.user_detail.email, "ends changesale function in CodeListController");
    };
    $scope.changesale = changesale;

    function changediscount(){
      Logging.log2FB($scope.user_detail.email, "starts changediscount function in CodeListController");
        if ($scope.code.promo_sale_price){
          $scope.code.promo_discount = "";
          console.log("discount had changed");
        }
        Logging.log2FB($scope.user_detail.email, "ends editCode function in CodeListController");
    };
    $scope.changediscount = changediscount;

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
          '<span class="input-label">Target</span><select ng-model="code.target"><option value="men" ng-selected=\'code.target == "men"\' >Men</option><option value="ladies" ng-selected=\'code.target == "ladies"\' >Ladies</option></select>' +
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
                //don't allow the user to close unless he enters code name
                e.preventDefault();
              } else {
                // console.log("item checked = " + $scope.code.commoncolor)
                Codes.add(type, $scope.code);
                $scope.brands = Codes.get_brands();
                $scope.colors = Codes.get_colors();
                $scope.sizes = Codes.get_sizes();
                $scope.promos = Codes.get_promos();

                return;
              }
            }
          }
        ]
      });
    };

    $scope.removeCode = function(type, code_id) {
      Logging.log2FB($scope.user_detail.email, "starts removeCode function in CodeListController");
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
          $scope.promos = Codes.get_promos();
        }
      });
    };
    Logging.log2FB($scope.user_detail.email, "ends removeCode function in CodeListController");

}])
