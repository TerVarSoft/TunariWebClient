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
        quickSearchs = [];

    Settings.getList().then(function(settings){
        imgServer = _.find(settings, {'key': 'imgServer'}).value;
        quickSearchs = _.find(settings, {'key': 'quickSearchs'}).value;
        selectedPriceType = _.find(settings, {'key': 'priceTypes'}).value[0];
    });

    this.getProductImageUrl = function(product, suffix) {
        var imgUrl = ""
        
        if(product && !_.isEmpty(product.category))
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
            imgUrl= "/images/defaultProduct.gif"
        }

        return imgUrl;
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
}]);