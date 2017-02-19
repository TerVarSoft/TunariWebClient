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
      var newUser = {
        name: $scope.name,
        lastName: $scope.lastName,
        userName: $scope.userName,
        password: $scope.password
      }       

      Register.post(newUser).then(function(userToken) {
        AuthToken.setUserToken(userToken);  
        $location.path("/");    
      });
    }
  }]);
	
