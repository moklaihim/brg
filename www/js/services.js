angular.module('starter.services', [])

.factory('User', ["$timeout", "$firebaseAuth", function($timeout, $firebaseAuth) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var ref = new Firebase("https://fiery-heat-6039.firebaseIO.com/");
  var auth = $firebaseAuth(ref);
  var user = {};

  return {
    login: function(email, password, callback){
      auth.$authWithPassword({
        email: email,
        password: password
      }).then(function(res) {
        user = res;
        if (callback) {
          $timeout(function() {
            callback(res);
          });
        }
      }, function(err) {
        callback(err);
      });
    },

    register: function(email, password, callback) {
      auth.$createUser({email: email, password: password}).then(function(res) {
        user = res;
        if (callback) {
          callback(res)
        }
      }, function(err) {
        callback(err);
      });
    },

    getUser: function() {
      return user;
    },

    logout: function() {
      auth.$unauth();
      user = {};
    }
  }

}]);

document.write('<script type="text/javascript" src="js/services/Sales.js"></script>');
document.write('<script type="text/javascript" src="js/services/Items.js"></script>');
document.write('<script type="text/javascript" src="js/services/Stores.js"></script>');
