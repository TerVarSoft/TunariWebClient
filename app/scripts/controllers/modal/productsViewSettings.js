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
      
      Settings.getList().then(function(settings){
          $scope.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
      });

      $scope.saveSettings = function(){
          $mdDialog.hide($scope.selectedPriceType);
      }
    }]);