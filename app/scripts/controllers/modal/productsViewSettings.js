'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsViewSettingsCtrl', ['$scope', '$mdDialog', 'Settings', 'ProductInfo',
    function ($scope, $mdDialog, Settings, ProductInfo) {

      $scope.selectedPriceType = ProductInfo.getSelectedPriceType();     
      $scope.selectedPriceCategory = ProductInfo.getSelectedPriceCategory();       
      $scope.priceTypes = ProductInfo.getPriceTypes();    

      $scope.cancel = function() {
          $mdDialog.cancel();
      }

      $scope.saveSettings = function() {        
          var results = {
              selectedPriceType: $scope.selectedPriceType,
              selectedPriceCategory: $scope.selectedPriceCategory
          }

          $mdDialog.hide(results);
      }
    }]);