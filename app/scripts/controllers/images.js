'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:ImagesCtrl
 * @description
 * # ImagesCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('ImagesCtrl', ['$scope', '$http', '$mdDialog', 'Products', 'ProductInfo', 
    function ($scope, $http, $mdDialog, Products, ProductInfo) {
    
    $scope.layout.title = 'Monitor de Imagenes'; 
    $scope.layout.hideHeader = false;

    $scope.imagesIndicator = 0;
    $scope.loaderIsDeterminateMode = true;
    $scope.isTestButtonDisabled = false;
    $scope.noImageProducts = [];

    $scope.testImages = function() {
        $scope.imagesIndicator = 0;
        $scope.loaderIsDeterminateMode = false;
        $scope.isTestButtonDisabled = true;

        $scope.noImageProducts = [];

        Products.getList({properties: 'name category properties', queryLimit: 1000}).then(function(products) {
            var step = 100 /products.length;
            _.each(products, function(product, index) {

                $http.get(product.thumbnailUrl, {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                  }
                }).then(function() {
                    $scope.loaderIsDeterminateMode = true;
                    $scope.imagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isTestButtonDisabled = false;
                    }         
                }, function() {
                    $scope.loaderIsDeterminateMode = true;
                    $scope.imagesIndicator += step;
                    $scope.noImageProducts.push(product);

                    if (index === products.length - 1){ 
                        $scope.isTestButtonDisabled = false;
                    } 
                  });   
            });

        });
    }

    $scope.showResults = function() {
      $mdDialog.show({
            controller: 'NoImageProductsListCtrl',
            templateUrl: '../../views/modal/noImageProductsList.html',
            parent: angular.element(document.body),
            locals: {
                products: $scope.noImageProducts,
                title: "Productos sin imagenes"
            },
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function() {
        }, function() {});  
    }
  }]);
