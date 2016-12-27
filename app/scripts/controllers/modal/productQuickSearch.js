'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductQuickSearchCtrl', ['$scope', '$mdDialog', 'ProductInfo', 
    function ($scope, $mdDialog, ProductInfo) {
      $scope.tags = ProductInfo.getProductQuickSearchs();

      $scope.selectTag = function(selectedTag) {
          $mdDialog.hide(selectedTag);
      }
  }]);