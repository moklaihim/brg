angular.module('starter.controllers', [])

.controller('UserCtrl', ["$scope", "$ionicPopup", "User", function($scope, $ionicPopup, User) {
  //$scope.user = User.getUser();
  $ionicPopup.alert({
  					title: 'Login error!',
  					template:"ok" 
  });
}])

.controller('AccountCtrl', ["$scope", "$ionicPopup", "$state", "User", function($scope, $ionicPopup, $state, User) {
  $scope.user = User.getUser();

  $scope.login = function (){
  	User.login($scope.user.email, $scope.user.password, function(res)
  		{
  			if (res.uid) {
  				$scope.user = res;
          $state.go('sales-home');
  			} else {
  				$ionicPopup.alert({
  					title: 'Login error!',
  					template: res.message
  				});
  			}
  		});
  };

  $scope.register = function (){
  	User.register($scope.user.email, $scope.user.password, function(res)
		{
			if (res.uid) {
				$scope.user = res;
			} else {
				$ionicPopup.alert({
					title: 'Register Error!',
					template: res.message
				});
			}
		});
  };

  $scope.logout = function () {
  	User.logout();
  	$scope.user = {};
  };
}])

document.write('<script type="text/javascript" src="js/controllers/sales.js"></script>');
document.write('<script type="text/javascript" src="js/controllers/stocks.js"></script>');
document.write('<script type="text/javascript" src="js/controllers/SaleListController.js"></script>');
document.write('<script type="text/javascript" src="js/controllers/SaleAddController.js"></script>');
document.write('<script type="text/javascript" src="js/controllers/StoreListController.js"></script>');
document.write('<script type="text/javascript" src="js/controllers/ItemAddController.js"></script>');
