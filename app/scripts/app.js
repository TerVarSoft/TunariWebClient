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
    'ui.bootstrap',
    'ngMaterial',
    'ngMdIcons',
    'ngMessages',
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

    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
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
         months : "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
         weekdays : "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"), 
    });

    
    $routeProvider
      .when('/', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl',
        controllerAs: 'Products'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/shoppingTabs', {
        templateUrl: 'views/shoppingTabs.html',
        controller: 'ShopCtrl',
        controllerAs: 'ProductSearcher'
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl',
        controllerAs: 'Products'
      })
      .when('/products/:productId', {
        templateUrl: 'views/editProduct.html',
        controller: 'EditProductCtrl',
        controllerAs: 'editProduct'
      })
      .when('/newProduct', {
        templateUrl: 'views/newProduct.html',
        controller: 'NewProductCtrl',
        controllerAs: 'newProduct'
      })
      .when('/clientSearch', {
        templateUrl: 'views/clientSearch.html',
        controller: 'ClientSearchCtrl',
        controllerAs: 'clientSearch'
      })
      .when('/clientSamples/:clientId', {
        templateUrl: 'views/clientSamples.html',
        controller: 'ClientSamplesCtrl',
        controllerAs: 'clientSamples'
      })
      .when('/newClient', {
        templateUrl: 'views/newClient.html',
        controller: 'NewClientCtrl',
        controllerAs: 'newClient'
      })
      .when('/clients/:clientId', {
        templateUrl: 'views/editClient.html',
        controller: 'EditClientCtrl',
        controllerAs: 'editClient'
      })
      .when('/statistics', {
        templateUrl: 'views/statistics.html',
        controller: 'StatisticsCtrl',
        controllerAs: 'statistics'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

