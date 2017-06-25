'use strict';

/**
* @ngdoc service
* @name clientApp.productInfo
* @description
* # productInfo
* Service in the clientApp.
*/
angular.module('tunariApp')
  .service('ProductInfo', ["Settings", "Config", function (Settings, Config) {

    var imgServer = "",
        selectedPrice = "clientPackagePrice",
        quickSearchs = [],
        excludeListForStatistics = [];

    var priceTypesTexts = {};
    initPriceTypesTexts();

    Settings.getList().then(function(settings){
        imgServer = _.find(settings, {'key': 'imgServer'}).value;
        quickSearchs = _.find(settings, {'key': 'quickSearchs'}).value;        
        excludeListForStatistics = _.find(settings, {'key': 'excludeListForStatistics'}).value;
    });

    this.getProductImageUrl = function(product, suffix) {
        var imgUrl = ""
        
        if(product && product.name && !_.isEmpty(product.category))
        {
            if(product.category === 'Invitaciones' && !_.isEmpty(product.properties)) {
                imgUrl= imgServer + "/" +
                    product.category + "/" +
                    (product.properties.type || '' )+ "/" +
                    product.name + suffix +".jpg";
            }
            else {
                imgUrl= imgServer + "/" +
                    product.category + "/" +                    
                    product.name + suffix +".jpg";
            }            
        }
        else {
            imgUrl= "/images/tunari-logo-1.png"
        }

        return imgUrl;
    }

    this.getExtraImageUrl = function(image) {
        return imgServer + "/extras/" + image + ".jpg";     
    }

    this.setImageServer = function(newImageServer) {
        imgServer = newImageServer;
    }

    this.setProductQuickSearchs = function(newQuickSearchs) {
        quickSearchs = newQuickSearchs;
    }

    this.getProductQuickSearchs = function() {
        return quickSearchs;
    }


    this.setSelectedPrice = function(newSelectedPrice) {
        selectedPrice = newSelectedPrice;
    }

    this.getSelectedPrice = function () {
        return selectedPrice;
    }

    this.getPriceText = function (selectedPrice) {
        return priceTypesTexts[selectedPrice];
    }

    this.getPriceTypeTexts = function () {
        return priceTypesTexts;
    }

    this.setExcludeListForStatistics = function() {
        return excludeListForStatistics;
    }

    this.getExcludeListForStatistics = function() {
        return excludeListForStatistics;
    }

    function initPriceTypesTexts() {
        priceTypesTexts["clientUnitPrice"] = "Unidad Cliente";
        priceTypesTexts["clientPackagePrice"] = "Paquete Cliente";
        priceTypesTexts["publicUnitPrice"] = "Unidad Público";
        priceTypesTexts["publicPackagePrice"] = "Paquete Público";
    }
}]);