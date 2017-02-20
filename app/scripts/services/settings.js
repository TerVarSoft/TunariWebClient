'use strict';

/**
 * @ngdoc service
 * @name tunariApp.settings
 * @description
 * # settings
 * Service in the tunariApp.
 */
angular.module('tunariApp')
  .service('Settings', ['AuthRestangular', function (AuthRestangular) {
    return AuthRestangular.service('settings');
  }]);
