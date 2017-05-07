'use strict';

/**
 * @ngdoc service
 * @name tunariApp.login
 * @description
 * # login
 * Service in the TunariApp.
 */
angular.module('tunariApp')
  .service('Login', ['Restangular', function (Restangular) {
    return Restangular.service('login');
  }]);