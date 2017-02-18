'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.layout.title = 'Login'; 
    $scope.layout.hideHeader = true;

    $scope.loginUser = function() { 
      $scope.layout.hideHeader = false;     
      $location.path("/products");
    }     
  }]);
	
