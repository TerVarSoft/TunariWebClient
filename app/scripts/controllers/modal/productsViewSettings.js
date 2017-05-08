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
      $scope.priceTypes = ProductInfo.getPriceTypes();    

      $scope.saveSettings = function(){
          $mdDialog.hide($scope.selectedPriceType);
      }
    }]);