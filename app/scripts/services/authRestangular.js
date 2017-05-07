'use strict';

/**
 * @ngdoc service
 * @name tunariApp.authRestAngular
 * @description
 * # authRestAngular
 * Factory in the tunariApp.
 */
angular.module('tunariApp')
  .factory('AuthRestangular', ['Restangular', 'AuthInterceptor', function (Restangular, AuthInterceptor) {

    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.addFullRequestInterceptor(AuthInterceptor.request);
    });
  }]);