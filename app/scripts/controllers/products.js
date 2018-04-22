'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsCtrl', ['$scope', '$location', '$timeout', '$mdDialog', '$mdMedia', 'AuthRestangular', 'Config', 'Settings', 'Messages', 'Products', 'ProductInfo', 'SearchInfo',
    function ($scope, $location, $timeout, $mdDialog, $mdMedia, AuthRestangular, Config, Settings, Messages, Products, ProductInfo, SearchInfo) {

      $scope.layout.title = 'Productos';
      $scope.layout.hideHeader = false;

      var pagination = {
        page: 0,
        itemsPerPage: 30
      };
      var useFullScreenForModals = ($mdMedia('xs'));      
      $scope.searchTags = SearchInfo.getTags() || [];
      $scope.products = [];
      $scope.favorites = [];
      $scope.showFavorites = false;
      $scope.showSampleBook = false;
      $scope.selectedPrice = ProductInfo.getSelectedPrice();
      
      Settings.getList().then(function (settings) {
        $scope.productCategories = _.find(settings, { 'key': 'productCategories' }).value;
        $scope.selectedCategory = $scope.productCategories[0];

        // First initial search
        $scope.search();

        // Pull favorites
        updateFavorites();
      });

      $scope.search = function () {
        $scope.products = [];
        pagination.page = 0;

        if (_.isEmpty($scope.searchTags)) {
          $scope.showFavorites = true;
        } else {
          $scope.showFavorites = false;
        }

        $scope.searchMore();
      }

      $scope.searchMore = function () {
        $scope.isLoading = true;
        /** If no search, sort by updatedAt. 
         * Descending by default */
        var query = _.isEmpty($scope.searchTags)
          ? { querySort: "updatedAt", tags: $scope.selectedCategory.name }
          : { tags: $scope.selectedCategory.name + " " + $scope.searchTags.join(' ') };

        query.page = ++pagination.page;
        query.queryLimit = pagination.itemsPerPage;

        Products.getList(query).then(function (products) {
          $scope.products = _.concat($scope.products, products);
          $scope.showToast(products.meta.count + " Productos encontrados!", "TUNARI");
          SearchInfo.setTags($scope.searchTags);
          $scope.isLoading = false;
        }, handleRequestError);
      }
      
      $scope.changeCategory = function(selectedCategory) {
        $scope.selectedCategory = selectedCategory;
        updateFavorites();
        $scope.search();
      }

      $scope.toogleSampleBook = function () {
        $scope.showSampleBook = !$scope.showSampleBook;
        /**Timeout is needed due to 
         * refershing issues with materialized slider */
        $timeout(function () {
          $('.slider').slider({ interval: ProductInfo.getSampleBookInterval(), indicators: false });
        }, 200);
      }

      $scope.openCreateProductModal = function (event) {
        $scope.isLoading = true;
        $location.path("newProduct");
      }

      function manageCreateProductError(response) {
        var productName = response.config.data.name;
        if (response.status === 409) {
          $scope.showToast(_.template(Messages.message018)({ product: productName }), productName);
          console.log(_.template(Messages.message018)({ product: productName }));
        }
        else {
          console.log(Messages.message019);
        }
      }

      $scope.openEditProductModal = function (event, product) {
        $location.path("products/" + product._id);
      }

      $scope.openQuickSearchsModal = function (event) {

        $mdDialog.show({
          controller: 'ProductQuickSearchCtrl',
          templateUrl: '../../views/modal/productQuickSearch.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        }).then(function (selectedTag) {
          $scope.searchTags = [selectedTag];
          $scope.search();
        }, function () { });
      }

      $scope.openSelectPriceModal = function (event) {        
        $mdDialog.show({
          controller: 'ProductsViewSettingsCtrl',
          templateUrl: '../../views/modal/productsViewSettings.html',
          parent: angular.element(document.body),
          locals: {
            priceTypes: $scope.selectedCategory.priceTypes
          },
          targetEvent: event,
          clickOutsideToClose: true
        }).then(function (selectedPrice) {
          ProductInfo.setSelectedPrice(selectedPrice);
          $scope.selectedPrice = selectedPrice;          
        }, function () { });
      }

      $scope.openReduceQuantity = function (event, product) {
        var helpMessage = product.quantity ?
          'Existen ' + product.quantity + ' Unidades actualmente en el deposito.' :
          'No sabemos cuantas unidades hay de este producto :(';
        if (product.quantity) {
          var confirm = $mdDialog.prompt()
            .title('Venta del producto ' + product.name)
            .textContent('Existen ' + product.quantity + ' Unidades actualmente en el deposito.')
            .placeholder('Cantidad')
            .ariaLabel('quantity')
            .targetEvent(event)
            .ok('Vender!')
            .cancel('Cancelar');

          $mdDialog.show(confirm).then(function (quantityToReduce) {
            product.quantity -= quantityToReduce;
            product.quantity = product.quantity < 0 ? 0 : product.quantity;

            product.put().then(function () {
              $scope.showToast("Venta exitosa! Quedan: " + product.quantity + " Unidades", product.name);
            });
          }, function () { });
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

      $scope.deleteProduct = function (event, product) {
        var deleteProductModal = $mdDialog.confirm()
          .title('Esta seguro de borrar este producto?')
          .textContent('El producto seleccionado se borrara')
          .ariaLabel('Delete product')
          .targetEvent(event)
          .ok('Borralo!')
          .cancel('Cancelar');

        $mdDialog.show(deleteProductModal).then(function () {
          product.remove().then(function () {
            _.pull($scope.products, product);
            $scope.showToast(Messages.message006, product.name);
          }, function () { });
        });
      }

      $scope.openAddPriceWhenNoPriceModal = function (event, product) {

        var addPriceModal = $mdDialog.prompt()
          .title('Nuevo Precio!')
          .textContent('Agrega el precio: ' +
            $scope.selectedCategory.priceTypes[$scope.selectedPrice].name)            
          .placeholder('Nuevo Precio')
          .ariaLabel('Nuevo Precio')
          .targetEvent(event)
          .ok('Guardar')
          .cancel('Cancelar');

        $mdDialog.show(addPriceModal).then(function (newPrice) {
          product.prices[$scope.selectedPrice] = {
            type: $scope.selectedPrice,
            value: Number(newPrice)
          }

          product.put().then(function (product) {
            $scope.showToast("Agregaste un nuevo precio al producto ", product.name);
          });
        }, function () { });
      }

      $scope.searchFavorite = function (productName) {
        $scope.searchTags = [];
        $scope.searchTags.push(productName);
        $scope.search();
      }

      $scope.toggleFavorite = function (product) {

        if (product.isFavorite) {
          markProductAsNotFavorite(product);
        } else {
          markProductAsFavorite(product);
        }
      }

      function updateFavorites() {
        Products.getList({ isFavorite: true, tags: $scope.selectedCategory.name }).then(function (favorites) {
          $scope.favorites = favorites;
        }, handleRequestError);
      }

      /**
       * Timeout is needed due to refreshing  
       * problems with materialize carousel.
       */
      function markProductAsFavorite(product) {

        product.isFavorite = true;
        product.put().then(function () {
          $scope.favorites.push(product);
          $timeout(function () {
            var favoritesCarousel = $('.carousel');
            favoritesCarousel.removeClass('initialized');
            favoritesCarousel.carousel();
          }, 200);

        })
      }

      function markProductAsNotFavorite(product) {

        product.isFavorite = false;
        product.put().then(function () {
          _.remove($scope.favorites, { _id: product._id });
          $timeout(function () {
            var favoritesCarousel = $('.carousel');
            favoritesCarousel.removeClass('initialized');
            favoritesCarousel.carousel();
          }, 200);

        });
      }

      function handleRequestError(response) {
        if (response.status == 401) {
          console.log('Invalid jwt in local storage!, then redirecting to login');
          $location.path("/login");
        }
      }
    }]);
