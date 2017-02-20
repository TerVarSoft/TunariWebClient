'use strict';

/**
 * @ngdoc service
 * @name tunariApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the tunariApp.
 */
angular.module('tunariApp')
  .factory('AuthInterceptor', [ 'AuthToken', function (AuthToken) {
    
    var interceptor = {
      request: function(element, operation, route, url, headers, params) {
        var token = AuthToken.getToken();
        return {
          element: element,
          params: params,
          headers: {authorization: 'Bearer ' + token}
        };
      },
      response: function(response) {
        return response;
      }
    }

    return interceptor;
  }]);