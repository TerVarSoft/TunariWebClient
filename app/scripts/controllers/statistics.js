'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('StatisticsCtrl', ['$scope', '$mdMedia', 'Products', 'ProductInfo', 
    function ($scope, $mdMedia, Products, ProductInfo) {

    $scope.layout.title = 'Estadisticas';
    $scope.products = [];
    $scope.productsToGraph = [];
    $scope.searchTags = [];    

    $scope.search = function() {
        var query = _.isEmpty($scope.searchTags) ? {} : {tags: $scope.searchTags.join(' ')};
        query.category = 'Invitaciones';
        query.querySort = 'quantity';
        var limitToGraph = $mdMedia('xs') ? 5 : ($mdMedia('sm') ? 8 : ($mdMedia('md') ? 14 : 20));
        
        Products.getList(query).then(function(invitations) {            
            $scope.products = _.map(invitations, function(d){return d});
            $scope.productsToGraph = _.take($scope.products, limitToGraph);            
        });
    }  

    $scope.getProductImageUrl = function(product, sufix) {
        return  ProductInfo.getProductImageUrl(product, sufix);       
    }

    $scope.search();
  }]);
