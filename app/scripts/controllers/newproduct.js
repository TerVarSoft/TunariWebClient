'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewProductCtrl
 * @description
 * # NewProductCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('NewProductCtrl', 
              ['$scope', '$location', '$routeParams', '$mdDialog', 'AuthRestangular', 'Settings', 'ProductInfo', 'Products', 'Notifier', 'Messages',
             function ($scope, $location, $routeParams, $mdDialog, AuthRestangular, Settings, ProductInfo, Products, Notifier, Messages) {
        
    $scope.layout.title = "Nuevo Producto";
    $scope.layout.hideHeader = false;    
    $scope.productNames = [];
    $scope.newPrice = {};
    $scope.newLocation = {};
    $scope.imageExtensions = ["png", "jpg"];
    $scope.product = AuthRestangular.one('products');
    $scope.isLoading = true;    

    Settings.getList().then(function(settings) {
        $scope.categories = _.find(settings, {'key': 'productCategories'}).value;
        $scope.productProviders = _.find(settings, {'key': 'productProviders'}).value;

        $scope.newPrice.type = "";
        $scope.newPrice.value = 1;        

        $scope.locationTypes = _.find(settings, {key: 'locationTypes'}).value;
        $scope.newLocation.type = $scope.locationTypes[0];        

        if($routeParams.productId) {             
            Products.one($routeParams.productId).get().then(function(product) {
                $scope.product = product;
                $scope.priceTypes = _.find($scope.categories, {name:$scope.product.category}).priceTypes;
                $scope.originalName = $scope.product.name;
                $scope.layout.title = "Editar Producto " + $scope.product.name;

                setDefaultValues();
                $scope.updateView();
                $scope.isLoading = false;
            });
        } else {            
            setDefaultValues();
            $scope.updateView();
            $scope.isLoading = false;
        }
    });    

    $scope.updateCategory = function() {
        $scope.product.properties = {};
        $scope.updateView();        
    }   

    $scope.updateView = function() {
        $scope.specificPropertiesView = _.find($scope.categories, {name:$scope.product.category}).view;        
    }        

    $scope.addOtherPrice = function() {        

        $mdDialog.show({
            controller: 'AddProductPriceCtrl',
            templateUrl: '../../views/modal/addProductPrice.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true            
        }).then(function(newPrice) {
            $scope.product.otherPrices.splice(0, 0, newPrice);
        }, function() {}); 
    }

    $scope.removeOtherPrice = function(price) {
        _.pull($scope.product.otherPrices, price);
    }

    $scope.addLocationWareHouse = function(event) {
         
        var addLocation = $mdDialog.prompt()
            .title('Deposito')
            .clickOutsideToClose(true)
            .textContent('Agrega una nueva ubicacion en el deposito!')        
            .ariaLabel('wareHouseLocation')        
            .targetEvent(event)
            .ok('Guardar')
            .cancel('Cancelar');

            $mdDialog.show(addLocation).then(function(locationValue) {
                $scope.newLocation.type = 'Deposito';
                $scope.newLocation.value = locationValue;

                $scope.product.locations.splice(0, 0, $scope.newLocation);
                $scope.newLocation = {}
            });        
    }

    $scope.addLocationStore = function(event) {
        var addLocation = $mdDialog.prompt()
            .title('Tienda')
            .clickOutsideToClose(true)
            .textContent('Agrega una nueva ubicacion en la tienda!')        
            .ariaLabel('storeLocation')        
            .targetEvent(event)
            .ok('Guardar')
            .cancel('Cancelar');

            $mdDialog.show(addLocation).then(function(locationValue) {
                $scope.newLocation.type = 'Tienda';
                $scope.newLocation.value = locationValue;

                $scope.product.locations.splice(0, 0, $scope.newLocation);
                $scope.newLocation = {}
            }); 
    }

    $scope.removeLocation = function(location) {
        _.pull($scope.product.locations, location);
    }

    $scope.getProductImageUrl = function(product, sufix) {
        return  ProductInfo.getProductImageUrl(product, sufix);       
    }

    $scope.getExtraImageUrl = function(image) {
        return  ProductInfo.getExtraImageUrl(image);
    }

    $scope.save = function() {

        $scope.product.save().then(function(savedProduct){            
            $scope.showToast("Bien! Haz salvado el producto", savedProduct.name);
            $location.path("/products");
        }, function(response){            
            manageCreateProductError(response);
        });
    }   

    $scope.saveAndNew = function() {

        $scope.product.save().then(function(savedProduct){            
            $scope.showToast("Bien! Haz salvado el producto", savedProduct.name);
            $scope.product = AuthRestangular.one('products');
            $location.path("/newProduct");
        }, function(response){            
            manageCreateProductError(response);
        });
    }

    $scope.cancel = function() {
        $location.path("/products");
    }

    function setDefaultValues() {
        $scope.product.category = $scope.product.category ? 
                                    $scope.product.category : $scope.categories[0].name;        
        
        $scope.product.imageExtension = $scope.product.imageExtension || $scope.imageExtensions[0];                                     
        $scope.product.locations = $scope.product.locations || [];
        $scope.product.tags = $scope.product.tags ? $scope.product.tags : [];
        $scope.product.images =  $scope.product.images || [];        
        $scope.product.properties = $scope.product.properties || {};
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
  }]);
