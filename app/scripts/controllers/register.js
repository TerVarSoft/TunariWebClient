'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('RegisterCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.layout.title = 'Registrar Usuario';     

    
    $scope.registerUser = function() {       
      $location.path("/login");
    }     
  }]);
	
