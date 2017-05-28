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
      $scope.newPrice.type = "Paquete";
      $scope.newPrice.quantity = 100;

      $scope.priceTypes = ProductInfo.getPriceTypes();

      $scope.selectPriceType = function() {
          if(_.includes($scope.newPrice.type, 'Unidad')) {
              $scope.newPrice.quantity = 1;
          } else {
              $scope.newPrice.quantity = 100;
          }
      }

      $scope.addPrice = function() {
          $mdDialog.hide($scope.newPrice);
      }

      $scope.cancel = function() {
          $mdDialog.cancel();
      }
    }]);