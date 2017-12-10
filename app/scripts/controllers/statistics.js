'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
    .controller('StatisticsCtrl', ['$scope', '$sce', '$mdMedia', '$timeout', 'Products', 'Settings', 'ProductInfo', 'AuthRestangular', 'Config',
        function ($scope, $sce, $mdMedia, $timeout, Products, Settings, ProductInfo, AuthRestangular, Config) {

            $scope.layout.title = 'Estadisticas (' + Config.kibanaUser + ' : ' + Config.kibanaPassword + ')';
            $scope.layout.hideHeader = false;

            AuthRestangular.all('products').customGET('log', {});

            $scope.isKibanaLoading = true;
            $scope.products = [];
            $scope.productsToGraph = [];
            $scope.searchTags = [];
            var excludeListForStatistics = [];

            /**Probably not needed, testing the timeout */
            $timeout(function() {
                $scope.chartUrls = [$sce.trustAsResourceUrl(Config.tunariChartsUrl)];
            },200);

            $scope.onKibanaLoaded = function () {
                $scope.isKibanaLoading = false;
            }

            $scope.refreshChart = function () {
                console.log('refreshing');
                AuthRestangular.all('products').customGET('log', {});
                $scope.chartUrls = [$sce.trustAsResourceUrl(Config.tunariChartsUrl)];
            }
        }]);
