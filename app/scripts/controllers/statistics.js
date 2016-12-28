'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('StatisticsCtrl', ['$scope', '$mdMedia', 'Products', 'Settings' ,'ProductInfo', 
    function ($scope, $mdMedia, Products, Settings, ProductInfo) {

    $scope.layout.title = 'Estadisticas';
    $scope.products = [];
    $scope.productsToGraph = [];
    $scope.searchTags = [];    
    var excludeListForStatistics = [];

    $scope.search = function() {
        var query = _.isEmpty($scope.searchTags) ? {} : {tags: $scope.searchTags.join(' ')};        
        query.querySort = 'quantity';        
        query.excludeProductNames = excludeListForStatistics.join(",");

        var limitToGraph = $mdMedia('xs') ? 5 : ($mdMedia('sm') ? 8 : ($mdMedia('md') ? 14 : 20));        
        Products.getList(query).then(function(invitations) {            
            $scope.showToast(invitations.meta.count + " Productos encontrados!","TUNARI");       
            
            // Dummy function to remove restangular stuff
            $scope.products = _.map(invitations, function(d){return d});
            $scope.productsToGraph = _.take($scope.products, limitToGraph);                   
        });
    }  

    $scope.getProductImageUrl = function(product, sufix) {
        return  ProductInfo.getProductImageUrl(product, sufix);       
    }

    Settings.getList().then(function(settings){
        excludeListForStatistics = _.find(settings, {'key': 'excludeListForStatistics'}).value;        
        $scope.search();        
    });
    
  }]);
