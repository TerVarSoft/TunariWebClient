'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:ImagesCtrl
 * @description
 * # ImagesCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('ImagesCtrl', ['$scope', '$http', '$mdDialog', 'AuthToken', 'Products', 'ProductInfo', 
    function ($scope, $http, $mdDialog, AuthToken, Products, ProductInfo) {
    
    $scope.layout.title = 'Administrar Imagenes'; 
    $scope.layout.hideHeader = false;

    $scope.smallImagesIndicator = 0;
    $scope.smallLoaderIsDeterminateMode = true;
    $scope.isSmallButtonDisabled = false;
    $scope.noSmallImageProducts = [];

    $scope.mediumImagesIndicator = 0;
    $scope.mediumLoaderIsDeterminateMode = true;
    $scope.isMediumButtonDisabled = false;
    $scope.noMediumImageProducts = [];

    $scope.largeImagesIndicator = 0;
    $scope.largeLoaderIsDeterminateMode = true;
    $scope.isLargeButtonDisabled = false;
    $scope.noLargeImageProducts = [];

    

    $scope.testSmallImages = function() {
        $scope.smallImagesIndicator = 0;
        $scope.smallLoaderIsDeterminateMode = false;
        $scope.isSmallButtonDisabled = true;

        $scope.noSmallImageProducts = [];

        Products.getList({properties: 'name category properties', queryLimit: 1000}).then(function(products) {
            var step = 100 /products.length;
            _.each(products, function(product, index) {

                $http.get(ProductInfo.getProductImageUrl(product, "-S"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(function() {
                    $scope.smallLoaderIsDeterminateMode = true;
                    $scope.smallImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isSmallButtonDisabled = false;
                    }         
                }, function() {
                    $scope.smallLoaderIsDeterminateMode = true;
                    $scope.smallImagesIndicator += step;
                    $scope.noSmallImageProducts.push(product);

                    if (index === products.length - 1){ 
                        $scope.isSmallButtonDisabled = false;
                    } 
                  });   
            });

        });
    }


    $scope.testMediumImages = function() {
        $scope.mediumImagesIndicator = 0;
        $scope.mediumLoaderIsDeterminateMode = false;
        $scope.isMediumButtonDisabled = true;

        $scope.noMediumImageProducts = [];

        Products.getList({properties: 'name category properties', queryLimit: 1000}).then(function(products) {
            var step = 100 /products.length;
            _.each(products, function(product, index) {

                $http.get(ProductInfo.getProductImageUrl(product, "-M"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(function() {
                    $scope.mediumLoaderIsDeterminateMode = true;
                    $scope.mediumImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isMediumButtonDisabled = false;
                    }         
                }, function() {
                    $scope.mediumLoaderIsDeterminateMode = true;
                    $scope.mediumImagesIndicator += step;
                    $scope.noMediumImageProducts.push(product);

                    if (index === products.length - 1){ 
                        $scope.isMediumButtonDisabled = false;
                    } 
                  });   
            });

        });
    }

    $scope.testLargeImages = function() {
        $scope.largeImagesIndicator = 0;
        $scope.largeLoaderIsDeterminateMode = false;
        $scope.isLargeButtonDisabled = true;

        $scope.noLargeImageProducts = [];

        Products.getList({properties: 'name category properties', queryLimit: 1000}).then(function(products) {
            var step = 100 /products.length;
            _.each(products, function(product, index) {

                $http.get(ProductInfo.getProductImageUrl(product, "-L"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(function() {
                    $scope.largeLoaderIsDeterminateMode = true;
                    $scope.largeImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isLargeButtonDisabled = false;
                    }         
                }, function() {
                    $scope.largeLoaderIsDeterminateMode = true;
                    $scope.largeImagesIndicator += step;
                    $scope.noLargeImageProducts.push(product);

                    if (index === products.length - 1){ 
                        $scope.isLargeButtonDisabled = false;
                    } 
                  });   
            });

        });
    }

    $scope.showSmallResults = function() {
      $mdDialog.show({
            controller: 'NoImageProductsListCtrl',
            templateUrl: '../../views/modal/noImageProductsList.html',
            parent: angular.element(document.body),
            locals: {
                products: $scope.noSmallImageProducts,
                title: "Productos sin imagenes pequeñas"
            },
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function() {
        }, function() {});  
    }

    $scope.showMediumResults = function() {
      $mdDialog.show({
            controller: 'NoImageProductsListCtrl',
            templateUrl: '../../views/modal/noImageProductsList.html',
            parent: angular.element(document.body),
            locals: {
                products: $scope.noMediumImageProducts,
                title: "Productos sin imagene medianas"
            },
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function() {
        }, function() {});
    }
    
    $scope.showLargeResults = function() {
      $mdDialog.show({
            controller: 'NoImageProductsListCtrl',
            templateUrl: '../../views/modal/noImageProductsList.html',
            parent: angular.element(document.body),
            locals: {
                products: $scope.noLargeImageProducts,
                title: "Productos sin imagenes grandes"
            },
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function() {
        }, function() {});
    }

    $scope.showProductsWithouthAnyImage = function() {

        var productsWithouthAnyImage = 
            _.intersectionBy($scope.noSmallImageProducts, $scope.noMediumImageProducts, 'name');

        var productsWithouthAnyImage = 
            _.intersectionBy(productsWithouthAnyImage, $scope.noLargeImageProducts, 'name');

        $mdDialog.show({
                controller: 'NoImageProductsListCtrl',
                templateUrl: '../../views/modal/noImageProductsList.html',
                parent: angular.element(document.body),
                locals: {
                    products: productsWithouthAnyImage,
                    title: "Productos sin ninguna imagen"
                },
                targetEvent: event,
                clickOutsideToClose: true
            }).then(function() {
            }, function() {});
    }
  }]);
