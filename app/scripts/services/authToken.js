'use strict';

/**
 * @ngdoc service
 * @name tunariApp.authToken
 * @description
 * # authToken
 * Service in the tunariApp.
 */
angular.module('tunariApp')
  .factory('AuthToken', ['$window', function ($window) {
    var storage = $window.localStorage;
    var cachedToken;
    var cachedUserFullName;
    var userTokenKey = 'userToken';    
    var userFullNameKey = 'userFullNameKey';
    
    var authToken = {
      setUserToken: function(userToken) {
        cachedToken = userToken.token;
        cachedUserFullName = userToken.user.name + " " + userToken.user.lastName;
        storage.setItem(userTokenKey, cachedToken);
        storage.setItem(userFullNameKey, cachedUserFullName);
      },
      getToken: function() {
        if(!cachedToken) {
          cachedToken = storage.getItem(userTokenKey);
        }

        return cachedToken;
      },
      getUserFullName: function() {
        if(!cachedUserFullName) {
          cachedUserFullName = storage.getItem(userFullNameKey);
        }

        return cachedUserFullName;
      },
      removeUserToken: function() {
        cachedToken = null;
        cachedUserFullName = null;
        storage.removeItem(userTokenKey);
        storage.removeItem(userFullNameKey);        
      },
      isAuthenticated: function() {
        return !!authToken.getToken();
      }
    }

    return authToken;
  }]);
