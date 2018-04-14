'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsViewSettingsCtrl', ['$scope', '$mdDialog', 'Settings', 'ProductInfo', 'priceTypes',
    function ($scope, $mdDialog, Settings, ProductInfo, priceTypes) {        
      $scope.selectedPrice = ProductInfo.getSelectedPrice();
      $scope.priceTypes = priceTypes;

      $scope.cancel = function() {
          $mdDialog.cancel();
      }

      $scope.saveSettings = function() {

          $mdDialog.hide($scope.selectedPrice);
      }
    }]);