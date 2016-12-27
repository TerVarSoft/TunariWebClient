'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsCtrl', ['$scope', '$location', '$mdDialog', '$mdMedia', 'Restangular', 'Config', 'Messages', 'Products', 'ProductInfo', 'SearchInfo',
        function ($scope, $location, $mdDialog, $mdMedia, Restangular, Config, Messages, Products, ProductInfo, SearchInfo) {
    
    $scope.layout.title = 'Productos';
    var pagination = {
        page: 0,
        itemsPerPage:30
    };  
    var useFullScreenForModals = ($mdMedia('xs'));     
    $scope.searchTags =[];
    $scope.products = [];
    $scope.selectedPriceType = ProductInfo.getSelectedPriceType() || 'Unidad';
    
    $scope.search = function() {
        $scope.products = [];
        pagination.page = 0;
        $scope.searchMore();
    }

    $scope.searchMore = function() {
        $scope.isLoading = true;
        var query = _.isEmpty($scope.searchTags) ? {} : {tags: $scope.searchTags.join(' ')};
        query.page = ++pagination.page;
        query.queryLimit = pagination.itemsPerPage;

        Products.getList(query).then(function(products) {
            $scope.products = _.concat($scope.products, products);
            $scope.totalProducts = products.meta.count;   
            SearchInfo.setTags($scope.searchTags);
            $scope.isLoading = false;
        });
    }     

    $scope.getProductImageUrl = function(product, sufix) {
        return  ProductInfo.getProductImageUrl(product, sufix);       
    }

    $scope.hasPriceToShow = function(product) {
        return _.some(product.prices, { type:  $scope.selectedPriceType });     
    }

    $scope.openCreateProductModal = function(event){    
        var newProduct = Restangular.one('products');

        $mdDialog.show({
            controller: 'NewProductCtrl',
            templateUrl: '../../views/modal/newProduct.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: useFullScreenForModals,
            locals : {
                product : newProduct
            }
        }).then(function() {            
            newProduct.save().then(function(productCreated){            
                $scope.products.splice(0, 0, productCreated);
                $scope.showToast(Messages.message002, productCreated.name);
            }, function(response){            
                manageCreateProductError(response);
            });
        }, function() {});
    }

    function manageCreateProductError(response) {
        if(response.code = 409) {    
            console.log(_.template(Messages.message018)({product : $scope.product.name}));                
        }
        else {                
            console.log(Messages.message019);
        }
    }

    $scope.openEditProductModal = function(event, product) {
        var productToEdit = Restangular.copy(product);

        $mdDialog.show({
            controller: 'NewProductCtrl',
            templateUrl: '../../views/modal/newProduct.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: useFullScreenForModals,
            locals : {
                product : productToEdit
            }
        }).then(function() {
            productToEdit.put().then(function(productEdited) {
                var productIndex = _.indexOf($scope.products, product);
                $scope.products.splice(productIndex, 1, productEdited)
                $scope.showToast(Messages.message004, productEdited.name);
            });                        
        }, function() {});
    }

    $scope.openQuickSearchsModal = function() {

        $mdDialog.show({
            controller: 'ProductQuickSearchCtrl',
            templateUrl: '../../views/modal/productQuickSearch.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true            
        }).then(function(selectedTag) {
            $scope.searchTags=[selectedTag];
            $scope.search();
        }, function() {});        
    }

    $scope.openProductsSettings = function() {

        $mdDialog.show({
            controller: 'ProductsViewSettingsCtrl',
            templateUrl: '../../views/modal/productsViewSettings.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true            
        }).then(function(selectedPriceType) {
           ProductInfo.setSelectedPriceType(selectedPriceType);
           $scope.selectedPriceType = selectedPriceType;
        }, function() {});  
    }

    $scope.deleteProduct = function(event, product) {
        var deleteProductModal = $mdDialog.confirm()
          .title('Esta seguro de borrar este producto?')
          .textContent('El producto seleccionado se borrara')
          .ariaLabel('Delete product')
          .targetEvent(event)
          .ok('Borralo!')
          .cancel('Cancelar');

        $mdDialog.show(deleteProductModal).then(function(){
            product.remove().then(function(){
                _.pull($scope.products, product);
                $scope.showToast(Messages.message006, product.name);
            });
        });
    }

    $scope.search();
  }]);
