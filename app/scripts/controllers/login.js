'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('LoginCtrl', ['$scope', '$location', 'Login', 'AuthToken',
    function ($scope, $location, Login, AuthToken) {

    $scope.layout.title = 'Login'; 
    $scope.layout.hideHeader = true;

    $scope.loginUser = function() {       

      /**
       * we create a user in this way instead of wrapping in
       * scope user due to errors with the forms validation
       * and the directive to control the match password.
       */
      var userToLogin = {
        userName: $scope.userName,          
        password: $scope.password
      }
      Login.post(userToLogin).then(function(userToken) {                        
        AuthToken.setUserToken(userToken);   
        $location.path("/");
      }, function(response) {
        if(response.status == 401) {
          $scope.showToast("Credenciales Invalidas","Problemas!");   
        }        
      });               
    }     
  }]);
	
