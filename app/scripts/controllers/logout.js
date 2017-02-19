'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('LogoutCtrl', ['$location', 'AuthToken', 
    function ($location, AuthToken) {

      AuthToken.removeUserToken();  
      $location.path("/login");   
  }]);
	
