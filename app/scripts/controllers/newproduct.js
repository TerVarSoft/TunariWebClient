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
    $scope.product = AuthRestangular.one('products');;    

    Settings.getList().then(function(settings) {
        $scope.categories = _.find(settings, {'key': 'productCategories'}).value;
        $scope.productProviders = _.find(settings, {'key': 'productProviders'}).value;

        $scope.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
        $scope.newPrice.type = _.find($scope.priceTypes, function(price) {return _.includes(price, 'Unidad')});
        $scope.newPrice.quantity = 1;

        $scope.locationTypes = _.find(settings, {key: 'locationTypes'}).value;
        $scope.newLocation.type = $scope.locationTypes[0];        

        if($routeParams.productId) { 
            $scope.isLoading = true;
            Products.one($routeParams.productId).get().then(function(product) {
                $scope.product = product;                      
                $scope.originalName = $scope.product.name;
                $scope.layout.title = "Editar Producto " + $scope.product.name;

                setDefaultValues();
                $scope.updateView();
                $scope.isLoading = false;
            });
        } else {
            setDefaultValues();
            $scope.updateView();
        }
    });    

    $scope.updateView = function() {
        $scope.specificPropertiesView = _.find($scope.categories, {name:$scope.product.category}).view;
        
    }    

    $scope.selectPriceType = function() {
        if(_.includes($scope.newPrice.type, 'Paquete')) {
            $scope.isNewPriceQuantityShowed = true;
            $scope.newPrice.quantity = 100;
        } else if($scope.newPrice.type === 'Otro') {
            $scope.isPriceTypeInputShowed = true;
            $scope.isNewPriceQuantityShowed = true;
            $scope.newPrice.quantity = 100;
        } else {
            $scope.isNewPriceQuantityShowed = false;
            $scope.newPrice.quantity = 1;
        }        
    }

    $scope.addPrice = function() {
        $scope.isPriceTypeInputShowed = false;
        $scope.product.prices.splice(0, 0, $scope.newPrice);
        $scope.newPrice = {}
    }

    $scope.removePrice = function(price) {
        _.pull($scope.product.prices, price);
    }

    $scope.addLocation = function() {        
        $scope.product.locations.splice(0, 0, $scope.newLocation);
        $scope.newLocation = {}
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
        prepareProductBeforeSaving();

        $scope.product.save().then(function(savedProduct){            
            $scope.showToast("Bien! Haz salvado el producto", savedProduct.name);
            $location.path("/products");
        }, function(response){            
            manageCreateProductError(response);
        });
    }   

    $scope.cancel = function() {
        $location.path("/products");
    }

    function prepareProductBeforeSaving() {  
        /**
         * Default value for sortTag, this can be overriden in 
         * prepareSpecificPropertiesBeforeProductSaving
         */          
        $scope.product.name = _.toUpper($scope.product.name);
        $scope.product.sortTag = $scope.product.category + $scope.product.name;

        $scope.product.tags = _.difference($scope.product.tags, _.intersection($scope.product.tags, _.map($scope.categories, 'name')));
        $scope.product.tags = _.difference($scope.product.tags, _.intersection($scope.product.tags, $scope.productProviders));              
        _.pull($scope.product.tags, $scope.originalName);
        
        $scope.product.tags.push($scope.product.name);       
        $scope.product.tags.push($scope.product.category);       
        $scope.product.tags.push($scope.product.provider); 

        $scope.$broadcast ('prepareSpecificPropertiesBeforeProductSaving');
        $scope.product.tags = _.filter($scope.product.tags, function(tag) {
            return !_.isEmpty(tag);
        });
    }

    function setDefaultValues() {
        $scope.product.category = $scope.product.category ? 
                                    $scope.product.category : $scope.categories[0].name;        
        
        $scope.product.prices = $scope.product.prices || [];
        $scope.product.locations = $scope.product.locations || [];
        $scope.product.tags = $scope.product.tags ? $scope.product.tags : [];
        $scope.product.images =  $scope.product.images || [];
        $scope.product.properties = $scope.product.properties ? $scope.product.properties : {};
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
