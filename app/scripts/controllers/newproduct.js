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
              ['$scope', '$location', '$mdDialog', 'Restangular', 'Settings', 'ProductInfo', 'Products', 'Notifier', 'Messages', 'product',
             function ($scope, $location, $mdDialog, Restangular, Settings, ProductInfo, Products, Notifier, Messages, product) {

    $scope.productNames = [];
    $scope.newPrice = {};
    $scope.newLocation = {};
    $scope.product = product;

    // backup
    var originalName = product.name;

    Settings.getList().then(function(settings){
        $scope.categories = _.find(settings, {'key': 'productCategories'}).value;
        $scope.productProviders = _.find(settings, {'key': 'productProviders'}).value;

        $scope.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
        $scope.newPrice.type = _.find($scope.priceTypes, function(price) {return _.includes(price, 'Unidad')});
        $scope.newPrice.quantity = 1;

        $scope.locationTypes = _.find(settings, {key: 'locationTypes'}).value;
        $scope.newLocation.type = $scope.locationTypes[0];

        setDefaultValues();
        $scope.updateView();
    });

    function setDefaultValues() {
        $scope.product.category = $scope.product.category ? 
                                    $scope.product.category : $scope.categories[0].name;        
        
        $scope.product.tags = $scope.product.tags ? $scope.product.tags : [];
        $scope.product.properties = $scope.product.properties ? $scope.product.properties : {};
    }

    $scope.updateView = function() {
        $scope.specificPropertiesView = _.find($scope.categories, {name:$scope.product.category}).view;
    }

    var prepareProductBeforeSaving = function() {  
        // Default value for sortTag, this can be overriden in prepareSpecificPropertiesBeforeProductSaving 
        $scope.product.sortTag = $scope.product.category + $scope.product.name;
        $scope.product.name = _.toUpper($scope.product.name);

        console.log($scope.categories);
        $scope.product.tags = _.difference($scope.product.tags, _.intersection($scope.product.tags, _.map($scope.categories, 'name')));
        $scope.product.tags = _.difference($scope.product.tags, _.intersection($scope.product.tags, $scope.productProviders));              
        _.pull($scope.product.tags, originalName);
        
        $scope.product.tags.push($scope.product.name);       
        $scope.product.tags.push($scope.product.category);       
        $scope.product.tags.push($scope.product.provider); 

        $scope.$broadcast ('prepareSpecificPropertiesBeforeProductSaving');
        $scope.product.tags = _.filter($scope.product.tags, function(tag) {
            return !_.isEmpty(tag);
        });
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.save = function() {
        prepareProductBeforeSaving();
        $mdDialog.hide();
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

    $('#name').focus();
  }]);
