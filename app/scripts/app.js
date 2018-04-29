'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('tunariApp', [
    'ngAnimate',
    'ngRoute',
    'restangular',
    'cgNotify',
    'ngMaterial',
    'ngMdIcons',
    'ngMessages',
    'ngOnload',
    'ui.materialize'
  ])
  .config(['$routeProvider', '$mdThemingProvider', '$httpProvider', 'RestangularProvider', 'Config',
    function ($routeProvider, $mdThemingProvider, $httpProvider, RestangularProvider, Config) {

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('pink');

      $mdThemingProvider.enableBrowserColor({
        hue: '500'
      });

      // Restangular global configurations
      RestangularProvider.setBaseUrl(Config.tunariApi + '/api');

      RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var extractedData;

        if (operation === "getList") {

          extractedData = data.data.items;
          extractedData.meta = data.data.meta;
        } else {
          extractedData = data.data;
        }
        return extractedData;
      });

      RestangularProvider.setRestangularFields({
        id: "_id"
      });

      // Moment.js global configuration
      moment.locale('es', {
        months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
        weekdays: "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"),
      });


      $routeProvider
        .when('/', {
          templateUrl: 'views/products.html',
          controller: 'ProductsCtrl',
          controllerAs: 'ProductsCtrl'
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'loginCtrl'
        })
        .when('/logout', {
          controller: 'LogoutCtrl',
          templateUrl: 'views/empty.html',
          controllerAs: 'logoutCtrl'
        })
        .when('/register', {
          templateUrl: 'views/register.html',
          controller: 'RegisterCtrl',
          controllerAs: 'registerCtrl'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'aboutCtrl'
        })
        .when('/shoppingTabs', {
          templateUrl: 'views/shoppingTabs.html',
          controller: 'ShopCtrl',
          controllerAs: 'ProductSearcherCtrl'
        })
        .when('/products', {
          templateUrl: 'views/products.html',
          controller: 'ProductsCtrl',
          controllerAs: 'ProductsCtrl'
        })
        .when('/products/:productId', {
          templateUrl: 'views/newProduct.html',
          controller: 'NewProductCtrl',
          controllerAs: 'editProductCtrl'
        })
        .when('/newProduct', {
          templateUrl: 'views/newProduct.html',
          controller: 'NewProductCtrl',
          controllerAs: 'newProductCtrl'
        })
        .when('/clientSearch', {
          templateUrl: 'views/clientSearch.html',
          controller: 'ClientSearchCtrl',
          controllerAs: 'clientSearchCtrl'
        })
        .when('/clientSamples/:clientId', {
          templateUrl: 'views/clientSamples.html',
          controller: 'ClientSamplesCtrl',
          controllerAs: 'clientSamplesCtrl'
        })
        .when('/newClient', {
          templateUrl: 'views/newClient.html',
          controller: 'NewClientCtrl',
          controllerAs: 'newClientCtrl'
        })
        .when('/clients/:clientId', {
          templateUrl: 'views/editClient.html',
          controller: 'EditClientCtrl',
          controllerAs: 'editClientCtrl'
        })
        .when('/images', {
          templateUrl: 'views/images.html',
          controller: 'ImagesCtrl',
          controllerAs: 'images'
        })
        .when('/statistics', {
          templateUrl: 'views/statistics.html',
          controller: 'StatisticsCtrl',
          controllerAs: 'statisticsCtrl'
        })
        .when('/settings', {
          templateUrl: 'views/settings.html',
          controller: 'SettingsCtrl',
          controllerAs: 'settingsCtrl'
        })
        .when('/users', {
          templateUrl: 'views/users.html',
          controller: 'UsersCtrl',
          controllerAs: 'usersCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
  .run(['$rootScope', '$location', 'AuthToken', function ($rootScope, $location, AuthToken) {
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (!AuthToken.isAuthenticated() && next.templateUrl != "views/login.html") {
        console.log('No token in local storage!, Then not authenticated, redirect to Login!');
        event.preventDefault();
        $location.path("/login");
      }
    });
  }]);;

