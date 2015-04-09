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

.controller('SalesCtrl', ["$scope", "$state", "User", function($scope, $state, User) {
  $scope.sales = [{name:"R31006-BLU-39", price:"109"}, {name:"R31019-BLK-41", price:"120"}, {name:"R31001-BLK-40", price:"93"}];
    
}])

;
