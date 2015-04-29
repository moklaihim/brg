angular.module("starter.controllers").controller("TestCtrl", ["$scope", "$ionicPopup", "$firebaseArray", "$firebaseObject", function($scope, $ionicPopup, $firebaseArray, $firebaseObject) {
  var ref = new Firebase("https://blistering-fire-7046.firebaseio.com/data");

  $scope.stocks = $firebaseArray(ref);
  // $scope.stocks.$add({
  //           item: "R54321-BLU-34",
  //           qty: 4
  //       });
  // $scope.stocks.$add({
  //           item: "R54321-BLU-35",
  //           qty: 4
  //       });
  // $scope.stocks.$add({
  //           item: "R54321-BLU-36",
  //           qty: 4
  //       });
  // $scope.stocks.$add({
  //           item: "R54321-BLU-37",
  //           qty: 4
  //       });


  // var syncObject = $firebaseObject(ref);
  // syncObject.$bindTo($scope, "stock");

  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!

  $scope.updateItem = function($key,$qty){
 
 	
  	$scope.stocks.$id = $key;
  	$scope.stocks.qty = $qty;
  	
  	// $qty = $qty + 1
  	  	
  	var item = $scope.stocks.$getRecord($scope.stocks.$id);
  	item.qty = $qty + 1;

  	$ionicPopup.alert({
            title: 'Alert',
            template: item.qty
        });
  	
  	$scope.stocks.$save(item).then(function(){});

  };

}]);

