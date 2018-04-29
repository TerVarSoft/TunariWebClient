'use strict';

/**
 * @ngdoc service
 * @name tunariApp.authRestAngular
 * @description
 * # authRestAngular
 * Factory in the tunariApp.
 */
angular.module('tunariApp')
  .factory('AuthRestangular', ['Restangular', 'AuthInterceptor', 'AuthToken', '$location',
    function (Restangular, AuthInterceptor, AuthToken, $location) {

      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.addFullRequestInterceptor(AuthInterceptor.request);

        RestangularConfigurer.setErrorInterceptor(function (response) {
          if (response.status == 401 && !response.config.url.includes("login")) {
            AuthToken.removeUserToken();
            $location.path("/login");
          }
        });
      });
    }]);