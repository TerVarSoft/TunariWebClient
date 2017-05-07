'use strict';

/**
 * @ngdoc directive
 * @name tunariApp.directive:preventRightClick
 * @description
 * # uppercase
 */
angular.module('tunariApp')
  .directive('preventRightClick', function() {
      return {
          restrict: 'A',
          link: function($scope, $ele) {
              $ele.bind("contextmenu", function(e) {
                  e.preventDefault();
              });
          }
      };
  });