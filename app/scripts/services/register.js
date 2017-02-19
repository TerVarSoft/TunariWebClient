'use strict';

/**
 * @ngdoc service
 * @name tunariApp.users
 * @description
 * # users
 * Service in the TunariApp.
 */
angular.module('tunariApp')
  .service('Register', ['Restangular', function (Restangular) {
    return Restangular.service('register');
  }]);