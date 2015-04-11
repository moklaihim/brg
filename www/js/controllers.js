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

.controller('SalesCtrl', ["$scope", "$state", "$ionicPlatform", "$firebaseArray", "User", function($scope, $state, $ionicPlatform, $firebaseArray, User) {
  //$ionicPlatform.ready(function() {
    //$scope.$storage = $localStorage.$default({
      //isEnableHoge: false,
      //positionXHoge: 10
    //});
    $store_id = "bm_taka";
    var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");

    $scope.sales = $firebaseArray(ref.child("sales/" + $store_id));
    //$scope.stores = $firebaseArray(ref.child("stores"));
    //$scope.stores.$add({
      
    /*
    $scope.sales.$add({
      item: "R31006-BLU-39",
      price: "109",
      date_time: "1-Apr-2015 12:30"
    });
    $scope.sales.$add({
      item: "R31012-BLK-41",
      price: "93",
      date_time: "1-Apr-2015 13:22"
    });
    $scope.sales.$add({
      item: "R31010-BRW-43",
      price: "109",
      date_time: "1-Apr-2015 16:50"
    });
    */
    $scope.date = "2-Apr-2015";
  //};

    $scope.showStoreList = function(){
        var ref = new Firebase("https://fiery-heat-6039.firebaseio.com/");
        //$scope.stores = $firebaseArray(ref.child("stores"));
        var syncObject = $firebaseObject(ref.child("stores");
        syncObject.$bindTo($scope, "stores");

        $scope.selectStoreView = true;
    }
}])
