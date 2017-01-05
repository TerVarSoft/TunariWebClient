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
        selectedPriceType = "",
        quickSearchs = [],
        excludeListForStatistics = [];

    Settings.getList().then(function(settings){
        imgServer = _.find(settings, {'key': 'imgServer'}).value;
        quickSearchs = _.find(settings, {'key': 'quickSearchs'}).value;
        selectedPriceType = _.find(settings, {'key': 'priceTypes'}).value[0];
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

    this.setSelectedPriceType = function(newSelectedPriceType) {
        selectedPriceType = newSelectedPriceType;
    }

    this.getSelectedPriceType = function() {
        return selectedPriceType;
    }

    this.setExcludeListForStatistics = function() {
        return excludeListForStatistics;
    }

    this.getExcludeListForStatistics = function() {
        return excludeListForStatistics;
    }
}]);