'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsCtrl', ['$scope', '$location', '$timeout', '$mdDialog', '$mdMedia', 'Restangular', 'Config', 'Messages', 'Products', 'ProductInfo', 'SearchInfo',
        function ($scope, $location, $timeout, $mdDialog, $mdMedia, Restangular, Config, Messages, Products, ProductInfo, SearchInfo) {
    
    //$scope.layout.title = 'Productos';
    var pagination = {
        page: 0,
        itemsPerPage:30
    };  
    var useFullScreenForModals = ($mdMedia('xs'));     
    $scope.searchTags =[];
    $scope.products = [];
    $scope.favorites = [];
    $scope.showFavorites = false;
    $scope.selectedPriceType = ProductInfo.getSelectedPriceType() || 'Unidad';
    
    Products.getList({isFavorite: true}).then(function(favorites) {
        $scope.favorites = favorites
        $scope.showFavorites = true;  
    });

    $scope.search = function() {
        $scope.products = [];
        pagination.page = 0;

        if(_.isEmpty($scope.searchTags)) {
            $scope.showFavorites = true;
        } else {
            $scope.showFavorites = false;
        }

        $scope.searchMore();
    }    

    $scope.searchMore = function() {
        $scope.isLoading = true;
        var query = _.isEmpty($scope.searchTags) ? {} : {tags: $scope.searchTags.join(' ')};
        query.page = ++pagination.page;
        query.queryLimit = pagination.itemsPerPage;

        Products.getList(query).then(function(products) {
            $scope.products = _.concat($scope.products, products);
            $scope.showToast(products.meta.count + " Productos encontrados!","TUNARI");   
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

    $scope.openCreateProductModal = function(event) {    
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
        var productName = response.config.data.name;
        if(response.status === 409) {
            $scope.showToast(_.template(Messages.message018)({product : productName}), productName);    
            console.log(_.template(Messages.message018)({product : productName}));                
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

    $scope.openQuickSearchsModal = function(event) {

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

    $scope.openProductsSettings = function(event) {

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

    $scope.openReduceQuantity = function(event, product) {
        var helpMessage = product.quantity ? 
                        'Existen ' + product.quantity + ' Unidades actualmente en el deposito.' :
                        'No sabemos cuantas unidades hay de este producto :(';
        if(product.quantity) {             
            var confirm = $mdDialog.prompt()
                .title('Venta del producto ' + product.name)
                .textContent('Existen ' + product.quantity + ' Unidades actualmente en el deposito.' )
                .placeholder('Cantidad')
                .ariaLabel('quantity')            
                .targetEvent(event)
                .ok('Vender!')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function(quantityToReduce) {
                product.quantity -= quantityToReduce;
                product.quantity = product.quantity < 0 ? 0 : product.quantity;

                product.put().then(function(){
                    $scope.showToast("Venta exitosa! Quedan: " +  product.quantity + " Unidades", product.name );
                });
            }, function() {});
        } else {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('No sabemos cuantas unidades hay de este producto!')
                    .textContent('Edita el producto y especifica una cantidad')
                    .ariaLabel('No quantity')
                    .ok('Gracias!')
                    .targetEvent(event));
         }         
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
            }, function() {});
        });
    }

    $scope.searchFavorite = function(productName) {
        $scope.searchTags = [];
        $scope.searchTags.push(productName);
        $scope.search();
    }

    $scope.toggleFavorite = function(product) {                

        if(product.isFavorite) {
            markProductAsNotFavorite(product);
        } else {
            markProductAsFavorite(product);
        }                       
    }

    /**
     * Timeout is needed due to refreshing  
     * problems with materialize carousel.
     */
    function markProductAsFavorite(product) {
            
        product.isFavorite = true;                     
        product.put().then(function() {
            $scope.favorites.push(product); 
            $timeout(function() {                 
                var favoritesCarousel = $('.carousel');
                favoritesCarousel.removeClass('initialized');
                favoritesCarousel.carousel();
            }, 200);
            
        })
    }

    function markProductAsNotFavorite(product) {
        
        product.isFavorite = false;                             
        product.put().then(function() {
            _.remove($scope.favorites, { _id: product._id });
            $timeout(function() {                
                var favoritesCarousel = $('.carousel');
                favoritesCarousel.removeClass('initialized');
                favoritesCarousel.carousel();
            }, 200);
                
        });        
    }

    $scope.search();
  }]);
