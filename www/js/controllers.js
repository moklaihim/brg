angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', ["$scope", "$ionicPopup", "USer", function($scope, $ionicPopup, User) {
  $scope.user = User.getUser();

  $scope.login = function (){
  	User.login($scope.user.email, $scope.user.password, function(res)
  		{
  			if (res.id) {
  				$scope.user = res;
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
			if (res.id) {
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
}]);
