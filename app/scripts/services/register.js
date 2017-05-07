'use strict';

/**
 * @ngdoc service
 * @name tunariApp.users
 * @description
 * # users
 * Service in the TunariApp.
 */
angular.module('tunariApp')
  .service('Register', ['AuthRestangular', function (AuthRestangular) {
    return AuthRestangular.service('register');
  }]);