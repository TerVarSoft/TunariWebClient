'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:NoImageProductsListCtrl
 * @description
 * # NoImageProductsListCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('NoImageProductsListCtrl', ['$scope', '$mdDialog', 'products', 'title',
    function ($scope, $mdDialog, products, title) {

      $scope.title = title;
      $scope.products = products; 

    }]);