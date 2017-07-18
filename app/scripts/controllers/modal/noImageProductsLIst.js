'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:NoImageProductsListCtrl
 * @description
 * # NoImageProductsListCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('NoImageProductsListCtrl', ['$scope', '$mdDialog',
    function ($scope, ) {

      $scope.title = "Productos sin imagen";
      $scope.products = []; 

      $scope.cancel = function() {
          $mdDialog.cancel();
      }

    }]);