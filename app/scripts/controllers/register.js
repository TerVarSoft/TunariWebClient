'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('RegisterCtrl', ['$scope', '$location', 'Register', 'AuthToken',
    function ($scope, $location, Register, AuthToken) {

    $scope.layout.title = 'Registrar Usuario';     
    
    $scope.registerUser = function() {
      /**
       * we create a user in this way instead of wrapping in
       * scope user due to errors with the forms validation
       * and the directive to control the match password.
       */
      var newUser = {
        name: $scope.name,
        lastName: $scope.lastName,
        userName: $scope.userName,
        password: $scope.password
      }       

      Register.post(newUser).then(function(userToken) {
        $location.path("/");    
      });
    }
  }]);
	
