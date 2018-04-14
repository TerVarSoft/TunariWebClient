'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:AddProductPriceCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('AddProductPriceCtrl', ['$scope', '$mdDialog', 'ProductInfo',
    function ($scope, $mdDialog, ProductInfo) {

      $scope.newPrice = {};
      $scope.newPrice.quantity = 1;
      $scope.addPrice = function() {
          $mdDialog.hide($scope.newPrice);
      }

      $scope.cancel = function() {
          $mdDialog.cancel();
      }
    }]);