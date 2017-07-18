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
            _.each(products, (product, index) => {

                $http.get(ProductInfo.getProductImageUrl(product, "-S"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(() => {
                    $scope.smallLoaderIsDeterminateMode = true;
                    $scope.smallImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isSmallButtonDisabled = false;
                    }         
                }, () => {
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
            _.each(products, (product, index) => {

                $http.get(ProductInfo.getProductImageUrl(product, "-M"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(() => {
                    $scope.mediumLoaderIsDeterminateMode = true;
                    $scope.mediumImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isMediumButtonDisabled = false;
                    }         
                }, () => {
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
            _.each(products, (product, index) => {

                $http.get(ProductInfo.getProductImageUrl(product, "-L"), {
                  responseType: 'arraybuffer',
                  headers: {
                    'accept': 'image/webp,image/*,*/*;q=0.8',
                    'authorization': 'Bearer ' + AuthToken.getToken()
                  }
                }).then(() => {
                    $scope.largeLoaderIsDeterminateMode = true;
                    $scope.largeImagesIndicator += step;

                    if (index === products.length - 1){ 
                        $scope.isLargeButtonDisabled = false;
                    }         
                }, () => {
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
            targetEvent: event,
            clickOutsideToClose:true            
        }).then(function() {
            //$scope.searchTags=[selectedTag];
            //$scope.search();
        }, function() {});  
    }
    
    


  }]);