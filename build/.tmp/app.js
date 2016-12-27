'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('tunariApp', [
    'ngAnimate',
    'ngRoute',
    'restangular',
    'cgNotify',
    'ui.bootstrap',
    'ngMaterial',
    'ngMdIcons',
    'ngMessages',
    'ui.materialize'
  ])
  .config(['$routeProvider', '$mdThemingProvider', '$httpProvider', 'RestangularProvider', 'Config', 
    function ($routeProvider, $mdThemingProvider, $httpProvider, RestangularProvider, Config) {

    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('pink');
    
    $mdThemingProvider.enableBrowserColor({
      hue: '500'
    });

    // Restangular global configurations
    RestangularProvider.setBaseUrl(Config.tunariApi + '/api');

    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;

        if (operation === "getList") {

            extractedData = data.data.items;
            extractedData.meta = data.data.meta;
        } else {
            extractedData = data.data;
        }
        return extractedData;
    });

    RestangularProvider.setRestangularFields({
        id: "_id"
    });

    // Moment.js global configuration
    moment.locale('es', {
         months : "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
         weekdays : "Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado".split("_"), 
    });

    
    $routeProvider
      .when('/', {
        templateUrl: 'views/shoppingTabs.html',
        controller: 'ShopCtrl',
        controllerAs: 'ProductSearcher'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/shoppingTabs', {
        templateUrl: 'views/shoppingTabs.html',
        controller: 'ShopCtrl',
        controllerAs: 'ProductSearcher'
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl',
        controllerAs: 'Products'
      })
      .when('/products/:productId', {
        templateUrl: 'views/editProduct.html',
        controller: 'EditProductCtrl',
        controllerAs: 'editProduct'
      })
      .when('/newProduct', {
        templateUrl: 'views/newProduct.html',
        controller: 'NewProductCtrl',
        controllerAs: 'newProduct'
      })
      .when('/clientSearch', {
        templateUrl: 'views/clientSearch.html',
        controller: 'ClientSearchCtrl',
        controllerAs: 'clientSearch'
      })
      .when('/clientSamples/:clientId', {
        templateUrl: 'views/clientSamples.html',
        controller: 'ClientSamplesCtrl',
        controllerAs: 'clientSamples'
      })
      .when('/newClient', {
        templateUrl: 'views/newClient.html',
        controller: 'NewClientCtrl',
        controllerAs: 'newClient'
      })
      .when('/clients/:clientId', {
        templateUrl: 'views/editClient.html',
        controller: 'EditClientCtrl',
        controllerAs: 'editClient'
      })
      .when('/statistics', {
        templateUrl: 'views/statistics.html',
        controller: 'StatisticsCtrl',
        controllerAs: 'statistics'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);



'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddquantityCtrl
 * @description
 * # AddquantityCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('AddquantityCtrl', ['$scope', '$mdDialog', 'product', 
  	function ($scope, $mdDialog, product) {
    
    $scope.product = product;

    $scope.cancel = function () {
		$mdDialog.cancel();
	};

	$scope.add = function() {
		product.quantityToSell = $scope.quantity
		$mdDialog.hide();
	}
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddingproductCtrl
 * @description
 * # AddingproductCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('AddingProductCtrl', ['$scope', '$uibModalInstance', 'productName', 'Messages',
  	function ($scope, $uibModalInstance, productName, Messages) {

      $scope.productName = productName;
      $scope.messages = Messages;

      $scope.accept = function () {
        $uibModalInstance.close($scope.quantityToAdd);
      };
    
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };   
    
  }]);


'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:BottomsheetSellingoptionsCtrl
 * @description
 * # BottomsheetSellingoptionsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('SellingOptionsCtrl', ['$scope', '$mdBottomSheet', 
    function ($scope, $mdBottomSheet) {
    
    $scope.items = [
    	 {
      	 	name : "ResetProductQuantities",
      	 	text : "Resetear cantidades",
      	 	icon : "settings_backup_restore"
    	 },
       {
          name : "CleanShoppingCart",
          text : "Limpiar el carrito",
          icon : "delete"
       }
    ]

    $scope.listItemClick = function($index) {
  	    var clickedItem = $scope.items[$index];
  	    $mdBottomSheet.hide(clickedItem);
  	};
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ClientsamplesCtrl
 * @description
 * # ClientsamplesCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ClientSamplesCtrl', 
              ['Clients', 'Products', 'ServerData', '$scope', '$location', '$routeParams', 
            function (Clients, Products, ServerData, $scope, $location, $routeParams) {
    
    $scope.serverData = ServerData;
    ServerData.config.get().then(function(config){
        $scope.invitationTypes = config.invitationTypes;
        $scope.selectedType = $scope.invitationTypes[0]
    });

    $scope.distributedOptions = [ "Todos", "Repartidos", "No Repartidos" ];
    $scope.distributedOption = $scope.distributedOptions[0]
    
               
    $scope.client={};
    Clients.one($routeParams.clientId).get().then(function(client){
        $scope.client = client;

        // Save a clone of the product samples
        $scope.savedProductSamples = _.clone(client.productSamples);

        $scope.getInvitations();
    });
        
    $scope.getInvitations = function() {
        $scope.isAllMarked = false;

        if(!$scope.client.productSamples[$scope.selectedType]) {
            $scope.client.productSamples[$scope.selectedType] = [];
        }
        var query = {
            category:'Invitaciones',
            'properties.type': $scope.selectedType || 'Mementos'
        };  
        Products.getList(query).then(function(products){
            $scope.products = products;

            _.each($scope.products, function(product){
                product.isDistributed = _.includes($scope.client.productSamples[$scope.selectedType], product.name);                
            });
        });
    }
    
    $scope.filterDistributedOptions = function(product){
        var result = true;
        if($scope.distributedOption == "Repartidos"){
            result = product.isDistributed;
        }
        else if($scope.distributedOption == "No Repartidos"){
            result = !product.isDistributed;
        }
        return result;
    }
    
    $scope.addSample = function(product){
        
        if(_.includes($scope.client.productSamples[$scope.selectedType], product.name)){
            $scope.client.productSamples[$scope.selectedType] = 
            _.without($scope.client.productSamples[$scope.selectedType], product.name);
            product.isDistributed = false;
        }
        else{       
            $scope.client.productSamples[$scope.selectedType].push(product.name);
            product.isDistributed = true;
        }
    }
    
    $scope.saveModification = function(){
        $scope.client.save().then(function(){
             $location.path("/clientSearch");   
        });
    }

    $scope.cancelModifications = function(){
        $scope.client.productSamples = _.clone($scope.savedProductSamples);
        $location.path("/clientSearch");
    }
    
    $scope.toogleMark = function(){

        if($scope.products.length <= 0) return;

        if($scope.isAllMarked){
            $scope.client.productSamples[$scope.selectedType] = [];
            $scope.isAllMarked = false;
        }
        else{
            $scope.isAllMarked = true;
            $scope.client.productSamples[$scope.selectedType] = _.pluck($scope.products, 'name');
        }

        _.each($scope.products, function(product){
            product.isDistributed = $scope.isAllMarked;                
        });
    }    
}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ClientsearchCtrl
 * @description
 * # ClientsearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ClientSearchCtrl', ['$scope', '$location', 'Clients', function ($scope, $location, Clients) {
    
    $scope.header.title = 'Clientes';

    Clients.getList().then(function(clients) {   
        $scope.clients = clients;
        
        $scope.pagination = {}
        $scope.pagination.pageSize = 10;
        $scope.pagination.numberOfPages = Math.ceil($scope.clients.length/$scope.pagination.pageSize) ;
    });
  
    $scope.search = function(){
        Clients.getList({name:$scope.selectedClient.name}).then(function(clients) {
            $scope.clients = clients;
        });
    }
    
    $scope.editClient = function(clientId){
        $location.path("/clients/"+clientId);
    }
    
    $scope.showProductSamples = function(clientId){
        $location.path("/clientSamples/"+clientId);
    };
      
    $scope.windowTop = function(){
        window.scrollTo(0, 0);
    }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ContentctrlCtrl
 * @description
 * # ContentctrlCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ContentCtrl', ['$scope', '$mdSidenav', '$mdToast', 'SpeechRecognition', 
    function ($scope, $mdSidenav, $mdToast, SpeechRecognition) {

  	$scope.layout = {
  		title: 'Tunari',
      backupTitle: 'Tunari',
  		bottomFabButtonIcon: 'add',
  		bottomFabButtonIconTooltip: 'Oprimeme!',	    		    	
  	  recordIcon: 'mic' 
    }    

    $scope.isRecording = false;

  	$scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };    

    $scope.closeSideNav = function(menuId) {
        $mdSidenav(menuId).close()
    }
        
  	$scope.bottomFabRightButtonClick = function (ev) {
    	$scope.$broadcast('onBottomFabRightButtonClicked', {ev: ev});
  	}

    $scope.bottomFabLeftButtonClick = function () {
      $scope.$broadcast('onBottomFabLeftButtonClicked', {});
    }

    $scope.showToast = function(message, action) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .action(action)
            .highlightAction(true)
            .position('right')
            .hideDelay(1500)
            .parent(angular.element(document.body))
        );       
    }

    // Recording Functions
    $scope.toogleRecording = function () {

        $scope.isRecording = !$scope.isRecording;
        if($scope.isRecording) {
            try {                        
                SpeechRecognition.startRecognition();
                $scope.layout.recordIcon = 'mic_off';
            }
            catch (e) {
                $scope.layout.recordIcon = 'mic';
                $scope.showToast("No pude oir!, prueba otra vez", ":)")
            }
        } 
        else {
            $scope.layout.recordIcon = 'mic';
            SpeechRecognition.stopRecognition();
            $scope.$broadcast('onFinalResultFromSpeechRecognizer', 
              {finalSearchText: SpeechRecognition.getTranscript()});
        }              
    }

    function updateSearchText () {
        if($scope.isRecording) {
            $scope.layout.title = SpeechRecognition.getTranscript();
            $scope.$apply();
        }
    }

    function onFinalResult (finalResult) {
        if($scope.isRecording) {
            $scope.isRecording = false;   
            $scope.layout.recordIcon = 'mic';                     
            $scope.$broadcast('onFinalResultFromSpeechRecognizer', {finalSearchText: finalResult});
        }
    }

    SpeechRecognition.registirObserverOnResultCallback(updateSearchText);
    SpeechRecognition.registirObserverOnFinalResultCallback(onFinalResult);
  
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditclientCtrl
 * @description
 * # EditclientCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('EditClientCtrl', ['$scope', '$location', '$routeParams', '$uibModal', 'Clients', 'Notifier', 'Messages',
     function ($scope, $location, $routeParams, $uibModal, Clients, Notifier, Messages) {
    
        Clients.one($routeParams.clientId).get().then(function(client){
            $scope.client = client;

            // Save a clone of the client
            $scope.savedClient = $.extend(true, {}, $scope.client);
        });

        $scope.saveClient = function(){
            $scope.client.save().then(function(){
                $location.path("/clientSearch");   
                Notifier({ 
                    message: Messages.message003 + $scope.client.name,
                    classes: 'alert-info'
                });  
            });
        }

        $scope.cancelEditClient = function(){              
            $scope.client = $.extend(true, {}, $scope.savedClient);
            $location.path("/clientSearch"); 
        };        

        $scope.deleteClient = function () {

            var deleteModal = $uibModal.open({
              templateUrl: '../../views/questionModal.html',
              controller: 'QuestionModalCtrl',
              resolve: {
                options: function () {
                  return {
                    title: Messages.message008,
                    message: Messages.message009 + $scope.client.name + '?',
                  }
                }
              }
            });

            deleteModal.result.then(function () {
                Clients.one($routeParams.clientId).remove().then(function(){
                    $location.path("/clientSearch");  
                    Notifier({ 
                        message: Messages.message005 + $scope.client.name,
                        classes: 'alert-danger'
                    });
                });                    
            });
        };
}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:EditproductCtrl
 * @description
 * # EditproductCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('EditProductCtrl', ['$scope', '$location', '$routeParams', '$uibModal', 'Products', 'ServerData', 'Notifier', 'Messages',
    function ($scope, $location, $routeParams, $uibModal, Products, ServerData, Notifier, Messages){       
    
    $scope.serverData = ServerData; 
    
    $scope.product = Products.one($routeParams.productId).get().then(function(product){
        $scope.product = product; 
        $scope.tagsToRemoveWhenUpdating = getTagsToRemoveWhenUpdating();
        ServerData.config.get().then(function(config) {
            $scope.config = config;
            $scope.productView = _.where(config.productCategories, {name: $scope.product.category})[0].view;
        });    
    });

    var getTagsToRemoveWhenUpdating= function (){
        var tags = [$scope.product.name, $scope.product.provider];
        return tags;
    }
    
    $scope.saveProduct = function(){            
        prepareProductBeforeSaving();
        
        $scope.product.put().then(function(){
            $location.path("/productSearch");
            Notifier({ 
                message: Messages.message004 + $scope.product.name,
                classes: 'alert-info'
            }); 
        }, function(response){
            if(response.code = 409) {                
                Notifier({ 
                    message: _.template(Messages.message018)({product : $scope.product.name}),
                    classes: 'alert-danger'
                });
            }
            else {
                Notifier({ 
                    message: Messages.message019,
                    classes: 'alert-danger'
                });
            }
        });        
    }

    var prepareProductBeforeSaving = function(){
        // Default value for sortTag, this can be overriden in prepareSpecificPropertiesBeforeProductSaving
        $scope.product.sortTag = $scope.product.category + $scope.product.name;           
        
        $scope.product.tags = _.difference($scope.product.tags, $scope.tagsToRemoveWhenUpdating);
        $scope.product.tags.push($scope.product.name);
        $scope.product.tags.push($scope.product.provider);

        $scope.$broadcast ('prepareSpecificPropertiesBeforeProductSaving');   
    }
    
    $scope.cancelEditing = function() {
        $location.path("/productSearch");
    }
    
    $scope.deleteProduct = function () {
        var deleteModal = $uibModal.open({
            templateUrl: '../../views/questionModal.html',
            controller: 'QuestionModalCtrl',
            resolve: {
                options: function () {
                    return {
                        title: Messages.message010,
                        message: Messages.message011+ $scope.product.name + '?',
                    }
                }
            }
        });

        deleteModal.result.then(function () {
            Products.one($routeParams.productId).remove().then(function(){
                $location.path("/productSearch");  
                Notifier({ 
                    message: Messages.message006 + $scope.product.name,
                    classes: 'alert-danger'
                });
            });                    
        });
    };
    
}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewinvitationCtrl
 * @description
 * # NewinvitationCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('InvitationDetailsCtrl', ['$scope', 'Settings', function ($scope, Settings) {

    Settings.getList().then(function(settings){
        $scope.invitationTypes = _.find(settings, {'key': 'invitationTypes'}).value;
        $scope.$parent.product.properties.type = $scope.$parent.product.properties.type ?
                                                $scope.$parent.product.properties.type :
                                                $scope.invitationTypes[0];

        $scope.invitationsDetailsConfig = _.find(settings, {'key': 'invitationsDetails'}).value;        
        $scope.updatePropertiesOptions();        
    });

    $scope.updatePropertiesOptions = function() {
        var config = _.cloneDeep($scope.invitationsDetailsConfig);
        $scope.invitationDetails = config['Default'];

        var invitationType = $scope.$parent.product.properties.type;        
        _.mergeWith($scope.invitationDetails, config[invitationType] || {}, 
            // Replace first array with second array when merging
            // Default behavior would mix the arrays, that is not what we want
            function(a, b) {
                if (_.isArray(a)) {
                    return b;
                };
            }
        );
        
        $scope.invitationSizes = $scope.invitationDetails['sizes'];
        $scope.invitationGenres = $scope.invitationDetails['genres'];        
    }

    // Called by the parent scope
    $scope.$on('prepareSpecificPropertiesBeforeProductSaving', function(e) {
        // Remove current type, size, genre from tags
        $scope.$parent.product.tags = _.difference($scope.$parent.product.tags, _.intersection($scope.$parent.product.tags, $scope.invitationTypes));
        $scope.$parent.product.tags = _.difference($scope.$parent.product.tags, _.intersection($scope.$parent.product.tags, $scope.invitationSizes));
        $scope.$parent.product.tags = _.difference($scope.$parent.product.tags, _.intersection($scope.$parent.product.tags, $scope.invitationGenres));
            
        // Add new type, size, genre from tags
        $scope.$parent.product.tags.push($scope.$parent.product.properties.type);
        $scope.$parent.product.tags.push($scope.$parent.product.properties.size);
        $scope.$parent.product.tags.push($scope.$parent.product.properties.genre);

        var invitationNumber = getInvitationNumber();
        $scope.$parent.product.sortTag = $scope.$parent.product.properties.type + invitationNumber;
    });

    function getInvitationNumber() {
        var nameParts = $scope.$parent.product.name.split('-');

        var lastElement = _.last(nameParts);
        var isNum = /^\d+$/.test(lastElement);
        var number = "";

        if(isNum){
            number = lastElement;
        }
    
        return number;
    }

}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductquantitychartsCtrl
 * @description
 * # ProductquantitychartsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('InvitationsQuantityChartsCtrl', ['$scope', 'ServerData', 'Products',
    function ($scope, ServerData, Products) {
    	
        
        $scope.serverData = ServerData;
        var invitationsPerChart = 8;

        ServerData.config.get().then(function(config){

            $scope.invitationTypes = config.invitationTypes;

	        var colors = ['#4089A1', '#7DAB6D', '#AB7A6A', '#C5CC7A', '#82698C', '#7C8087', '#8DC9C6', '#DB5353']
            $scope.mappedColors = _.zipObject(_.zip($scope.invitationTypes, colors));      

            $scope.chartsData = {};
            _.each($scope.invitationTypes, function(invitationType){

                Products.getList({
                    category: 'Invitaciones', 
                    maxQuantity: 9000,
                    'properties.type': invitationType,
                    querySort: 'quantity',
                    queryLimit: invitationsPerChart
                })
                .then(function(invitations){

                    // Dummy map function to remove restangular extra stuff
                    $scope.chartsData[invitationType] = _.map(invitations,function(d){return d});
                });
            });
        });        
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });


'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ModalImageCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ImageCtrl', ['$scope', '$mdDialog', '$mdMedia', 'ServerData', 'product', 
    function ($scope, $mdDialog, $mdMedia, ServerData, product) {
    
    $scope.product = product;

    $scope.getImageUrl = function() {
      var isSmall = ($mdMedia('sm') || $mdMedia('xs'));

      var imageUrl = ServerData.urlImages + "/" + 
          $scope.product.category + "/" + 
          ($scope.product.properties.type || '') + "/" +
          $scope.product.name;

    	return isSmall ? imageUrl + "-M.jpg" : imageUrl + "-L.jpg";
    }    

    $scope.cancel = function () {
  		  $mdDialog.cancel();
  	};
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductQuickSearchCtrl', ['$scope', '$mdDialog', 'ProductInfo', 
    function ($scope, $mdDialog, ProductInfo) {
      $scope.tags = ProductInfo.getProductQuickSearchs();

      $scope.selectTag = function(selectedTag) {
          $mdDialog.hide(selectedTag);
      }
  }]);
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalImageCtrl
 * @description
 * # ProductQuickSearchCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ProductsViewSettingsCtrl', ['$scope', '$mdDialog', 'Settings', 'ProductInfo', 
    function ($scope, $mdDialog, Settings, ProductInfo) {

      $scope.selectedPriceType = ProductInfo.getSelectedPriceType();
      
      Settings.getList().then(function(settings){
          $scope.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
      });

      $scope.saveSettings = function(){
          $mdDialog.hide($scope.selectedPriceType);
      }
    }]);
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ModalSummarycartCtrl
 * @description
 * # ModalSummarycartCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('summaryCartCtrl', ['$scope', '$mdDialog', 'Clients', 'sellingItems', 'sellClient',
  	function ($scope, $mdDialog, Clients, sellingItems, sellClient) {
    
    $scope.sellingItems = sellingItems;
    $scope.selectedClient = sellClient;

    Clients.getList().then(function(clients) {
        $scope.clients = clients;
    });

    $scope.cancel = function () {
	  	  $mdDialog.cancel($scope.selectedClient);
	  }; 	

    $scope.getTotal = function() {
        var result = _.sum($scope.sellingItems, function(sellingItem){
            return sellingItem.total;
        });

        return _.round(result, 2);
    };

    $scope.sell = function () {   	
	  	  $mdDialog.hide($scope.getTotal());
	  };

    // Client autocomplete functions.
	  $scope.queryClientSearch = function(query) {
        var results = query ? $scope.clients.filter( createFilterFor(query) ) : $scope.clients;
        return results;
  	}

  	function createFilterFor(query) {
    		var lowercaseQuery = angular.lowercase(query);
    		return function filterFn(client) {
    			return (client.name.indexOf(lowercaseQuery) === 0);
    		};
    }
    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('NavBarCtrl', ['$scope', '$location', '$mdSidenav', function ($scope, $location, $mdSidenav) {
    
  	$scope.subMenu = "views/productsSubmenu.html"
  	 
    $scope.menus = {
      shopping: {
        icon: 'dashboard',
        redirectTo: '/productSearch',
        subMenuView: 'views/productsSubMenu.html',
        propName: 'shopping',
        text: 'Ventas'
      },
      products: {
        icon: 'store',
        redirectTo: '/products',
        propName: 'products',
        text: 'Productos'
      },
      settings: {
        icon: 'settings',
        redirectTo: '/settings',
        propName: 'settings',
        text: 'Configuraciones'
      }
      /*clients: {
        icon: 'people',
        redirectTo: '/clientSearch',  	
        subMenuView: 'views/clientsSubMenu.html',
        propName: 'clients',
        text: 'Clientes'		
      },
      statistics: {
        icon: 'insert_chart',
        redirectTo: '/statistics',
        propName: 'statistics',
        text: 'Estadisticas'  			
      }*/
    }

    $scope.changeView = function(menuItem){
      $scope.subMenu = $scope.menus[menuItem].subMenuView || "";
      $location.path($scope.menus[menuItem].redirectTo);  
      $mdSidenav('sideNav').toggle();
    }

  	// Collapse navBar when clicking an menu item
	$("#js-navbar-collapse a").on("click", function () {
         $("#js-navbar-collapse").collapse('hide');	   
     });

	// Desactivate menu items and activate selected
	// menu item
	$(".nav a").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(this).parent().addClass("active");
	});
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewclientCtrl
 * @description
 * # NewclientCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('NewClientCtrl', ['$scope', '$location','Clients', 'Notifier', 'Messages', 'ServerData',
    function ($scope, $location, Clients, Notifier, Messages, ServerData) {


    $scope.createClient = function(){
        
        $scope.newClient.productSamples = {};
        ServerData.config.get().then(function(config){
            var invitationTypes = config.invitationTypes;
            
            _.each(invitationTypes, function(invitationType){
                $scope.newClient.productSamples[invitationType] = [];
            });

            Clients.post($scope.newClient).then(function(){
                $location.path("/clientSearch");  
                Notifier({ 
                    message: Messages.message001 + $scope.newClient.name,
                    classes: 'alert-success'
                });  
            });   
        });
        
        $(".nav").find(".active").removeClass("active");             
    }

    $scope.cancelNewClient = function(){
        $location.path("/clientSearch"); 
        $(".nav").find(".active").removeClass("active"); 
    };
        
    $('#name').focus();
  }]);

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

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DeleteclientCtrl
 * @description
 * # DeleteclientCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('QuestionModalCtrl', ['$scope', '$uibModalInstance', 'options', function ($scope, $uibModalInstance, options) {
    
      $scope.options = options;
	
      $scope.accept = function () {
        $uibModalInstance.close();
      };
	
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SamplebookCtrl
 * @description
 * # SamplebookCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('SamplebookCtrl', ['$scope', '$uibModalInstance', 'ServerData', 'product', 
  	function ($scope, $uibModalInstance, ServerData, product) {    

		$scope.imageUrl = 	 ServerData.urlImages + "/" + 
							           product.category + "/" + 
							           (product.properties.type || '') + "/" +
							           product.name + "-L.jpg"

  		$scope.dissmissModal = function () {
      	  $uibModalInstance.dismiss();
      	};
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddingproducttocartCtrl
 * @description
 * # AddingproducttocartCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('sellingItemCtrl', ['$scope', '$mdDialog', 'ServerData', 'SellingItemInfo', 'sellingItem',
   function ($scope, $mdDialog, ServerData, SellingItemInfo, sellingItem) {
   
      $scope.selling = $.extend(true, {}, sellingItem);     

      // Initialize productPrice with an element from prices
      // to prevent productPrice dropdown from displaying empty options
      $scope.selling.productPrice = _.where($scope.selling.product.prices, 
        {
          _id: $scope.selling.productPrice._id
        })[0];
      
      $scope.serverData = ServerData;

      $scope.imageUrl =  ServerData.urlImages + "/" + 
                         $scope.selling.product.category + "/" + 
                         ($scope.selling.product.properties.type || '') + "/" +
                         $scope.selling.product.name + "-M.jpg"

      $scope.updateTotal = function() { 
        SellingItemInfo.updateProperties($scope.selling);
      }      

      $scope.saveSelling = function () {
          sellingItem = $scope.selling;
          $mdDialog.hide(sellingItem);
      };
	    
      $scope.cancel = function () {
      	  $mdDialog.cancel();
      }; 
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellingschartsCtrl
 * @description
 * # SellingschartsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('SellingsChartsCtrl', ["$scope", "Sellings", 
    function ($scope, Sellings) {  	      

    $scope.getSellings = function() {

        Sellings.getList({
            from: moment($scope.from).format($scope.format), 
            to: moment($scope.to).format($scope.format)
        }).then(function(sellings) {      
            $scope.sellings = [];
            _.each(sellings, function(selling){ 
                _.map(selling.sellingItems, function(sellingItem){
                    sellingItem.client = selling.client[0];
                    sellingItem.date = selling.date;

                    return sellingItem;
                });
                 
                $scope.sellings = $scope.sellings.concat(selling.sellingItems);
            });

            $scope.totalSellings = _.round(_.sum($scope.sellings, 'total'), 2);
        }); 
    }

    $scope.formatDate = function(date) {    	
        return moment(date).format("dddd, MMMM DD YYYY");;
    }

    $scope.formatHour = function(date) {    	
        return moment(date).format("h:mm:ss a");;
    }

    $scope.format = "YYYY-MM-DD HH:mm:ss"
    $scope.from = moment({ hour:0, minute:0, second:0 }).format($scope.format);
    $scope.to = moment({ hour:23, minute:59, second:59 }).format($scope.format);

    $scope.getSellings(); 
}]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('SettingsCtrl', ['$scope', '$window', '$location', 'Settings', 'ProductInfo',
        function ($scope, $window, $location, Settings, ProductInfo) {

    $scope.layout.title = 'Configuraciones';

    Settings.getList().then(function(settings){
        $scope.imgServer = _.find(settings, {'key': 'imgServer'});    
        $scope.quickSearchs = _.find(settings, {'key': 'quickSearchs'});
        console.log($scope.quickSearchs);

        if(!$scope.imgServer) {
          Settings.post({key:"imgServer", value:""}).then(function(newSetting){
            $scope.imgServer = newSetting;
          });
        }

        if(!$scope.quickSearchs) {
          Settings.post({key:"quickSearchs", value:[]}).then(function(newSetting){
            $scope.quickSearchs = newSetting;
          });
        }
    });

    $scope.testImgServer = function() {
        $window.location.href = $scope.imgServer.value + '/test.html?returnUrl=' + $location.absUrl();
    }

    $scope.saveSettings = function() {
        $scope.imgServer.save().then(function(){
            ProductInfo.setImageServer($scope.imgServer.value);
        });
        $scope.quickSearchs.save().then(function(){
            ProductInfo.setProductQuickSearchs($scope.quickSearchs.value);
        });

        $location.path('/products');
    }
     
  }]);
	

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsearcherCtrl
 * @description
 * # ProductsearcherCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('ShopCtrl', 
              ['$scope', '$mdSidenav', '$mdDialog', '$mdToast', '$mdBottomSheet', '$mdMedia', '$location', '$uibModal', 'Products', 'ProductInfo', 'ServerData', 'SearchInfo', 'SellingItemInfo','Messages', 'Notifier',
              function ($scope, $mdSidenav, $mdDialog, $mdToast, $mdBottomSheet, $mdMedia, $location, $uibModal, Products, ProductInfo, ServerData, SearchInfo, SellingItemInfo, Messages, Notifier) {

    $scope.layout.title = 'Productos';
    $scope.layout.backupTitle = 'Productos';    
    $scope.layout.bottomFabButtonIcon = 'shopping_cart';
    $scope.layout.bottomFabButtonIconTooltip = 'Ver el Carrito';   

    $scope.serverData = ServerData;
    $scope.tags = SearchInfo.getTags();
    
    $scope.pagination = {
        current: 1,
        itemsPerPage: 30
    };

    $scope.isLoading = true;

    $scope.search = function(page){
        $scope.isLoading = true;
        var query = $scope.tags ? {tags: $scope.tags} : {};
        query.page = page;
        query.queryLimit = $scope.pagination.itemsPerPage;

        Products.getList(query).then(function(products) {
            $scope.products = products;
            $scope.totalProducts = products.meta.count; 
            $scope.pagination.current = page;    
            SearchInfo.setTags($scope.tags);
            $scope.isLoading = false;
        });
    }    

    $scope.pageChanged = function(newPage) {
        $scope.search(newPage);
    };    

    $scope.openQuantityModal = function(product, ev) {
        ev.stopPropagation();

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'AddquantityCtrl',
          templateUrl: '../../views/addQuantity.html',
          locals: {
            product: product
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
    }

    $scope.openImageModal = function(product, ev) {
        ev.stopPropagation();

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'ImageCtrl',
          templateUrl: '../../views/modal/image.html',
          locals: {
            product: product
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
    }

    $scope.addQuantity = function(product) {
        product.quantityToSell ++;
    }

    $scope.stepUpQuantity = function(product, ev) {
        var ceil = _.ceil((product.quantityToSell + 1) / 25);

        product.quantityToSell = 25 * ceil ;
    }

    $scope.stepDownQuantity = function(product, ev) {
        var floor = _.floor((product.quantityToSell - 1) / 25);

        product.quantityToSell = 25 * floor ;     
        if(product.quantityToSell < 0) product.quantityToSell = 0;
    }

    $scope.addToCart = function(product, ev) {
        ev.stopPropagation();        

        if(product.quantityToSell > product.quantity) {
             $scope.$parent.showToast("Solo hay " + product.quantity + " unidades en el deposito!", product.name);
             product.quantityToSell = 0;
             return;
        }

        var sellingItem = _.find($scope.shoppingCartSellings, function(selling) {
            return selling.product.name === product.name; 
        });

        if(sellingItem) {
          sellingItem.quantity += product.quantityToSell;
        }
        else
        {
            sellingItem = {
                product: product,
                productPrice: product.prices[0],
                quantity: product.quantityToSell
            };  
            $scope.shoppingCartSellings.push(sellingItem);
            $scope.$parent.cartItemsCount ++;
        }        

        SellingItemInfo.updateProperties(sellingItem);
        
        product.quantityToSell = 0;
        $scope.$parent.showToast('Agregaste un producto al carrito!', product.name);        
    }

    $scope.getProductImageUrl = function(product, sufix) {
        return  ProductInfo.getProductImageUrl(product, sufix);
    }

    $scope.addProduct = function(product) {
        var addProductModal = $uibModal.open({
          templateUrl: '../../views/addingProduct.html',
          controller: 'AddingProductCtrl',
          resolve: {
            productName: function () {
              return product.name;
            }
          }
        });

        addProductModal.result.then(function (quantityToAdd) {
            product.quantity += quantityToAdd;
            product.save();

            Notifier({ 
                message: Messages.message012 + product.name + ' : ' + product.quantity,
                classes: 'alert-info'
            });                    
        });
    };              

    $scope.editProduct = function(productId){
        $location.path ("products/" + productId);
    }    
    
    $scope.windowTop = function(){
        window.scrollTo(0, 0);
    }            
    
    $scope.queryProductSearchNames = function(query) {        
        if (query && query !== "") {
            console.log("asdfsdf")
            var query = query ? {tags:query} : {};                
            query.properties = "name";
            query.querySort = "name";
            query.queryLimit = 10;

            $scope.productSearchText = null;

            return Products.getList(query).then(function(products) {
                var productNames = _.map(products, 'name');
                
                return productNames;
            });       
        }
        else {
            return [];
        }

    };

    $scope.setTags = function(text) {
        $scope.tags = text;
    }

    $scope.$on('onBottomFabRightButtonClicked', function(event, args) {        
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
            controller: 'summaryCartCtrl',
            templateUrl: '../../views/modal/summaryCart.html',
            locals: {
              sellingItems: $scope.shoppingCartSellings,
              sellClient: $scope.sellClient
            },
            parent: angular.element(document.body),
            targetEvent: args.ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        })
        .then(function(total) {

            $scope.shoppingCartSellings = [];
            $scope.$parent.showToast('Venta exitosa!', "Total: " + total +  " Bs.");  
        }, function(sellClient) {
            $scope.sellClient = sellClient;        
        });
    });

    $scope.$on('onBottomFabLeftButtonClicked', function (ev, obj) {
        $mdBottomSheet.show({
          templateUrl: '../../views/bottomSheet/sellingOptions.html',
          controller: 'SellingOptionsCtrl'
        }).then(function(clickedItem) {
            if(clickedItem.name === "ResetProductQuantities") {
                ResetProductQuantities();
            }
            else if(clickedItem.name === "CleanShoppingCart") {
                CleanShoppingCart();
            }            
        });
    });

    $scope.$on('onFinalResultFromSpeechRecognizer', function (ev, obj) {
        $scope.tags = obj.finalSearchText;
        $scope.search($scope.tags, 1);
    });

    function ResetProductQuantities()
    {
        _.forEach($scope.products, function(product){
            product.quantityToSell = 0;
        });
    }


    // Shopping cart functions
    $scope.shoppingCartSellings = [];
    $scope.sellClient; 

    $scope.openSell = function(selling, ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'sellingItemCtrl',
          templateUrl: '../../views/sellingItem.html',
          locals: {
            sellingItem: {
                product: selling.product,
                productPrice: selling.productPrice,
                quantity: selling.quantity,
                total: selling.total
            }
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(sellingItem) {
            var indexToUpdate = _.findIndex($scope.shoppingCartSellings, 
                function(selling) { 
                    return selling.product.name == sellingItem.product.name; 
                }
            );
            $scope.shoppingCartSellings[indexToUpdate] = sellingItem;
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    }  

    $scope.removeSelling = function(selling) {
        _.pull($scope.shoppingCartSellings, selling);
    }  

    $scope.getTotal = function() {
        var result = _.sum($scope.shoppingCartSellings, function(sellingItem){
            return sellingItem.total;
        });

        return _.round(result, 2);
    };

    function CleanShoppingCart()
    {
        $scope.shoppingCartSellings = [];
    }

    $scope.search(1);    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsCtrl
 * @description
 * # StatisticsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('StatisticsCtrl', ['$scope', '$uibModal', 'ServerData', function ($scope, $uibModal, ServerData) {

      $scope.header.title = 'Estadisticas';

      ServerData.config.get().then(function(config){
          $scope.statisticsView = config.statisticsViews[0].view;  
      });

      $scope.openOptionsModal = function (){
      	  var optionsModal = $uibModal.open({
              templateUrl: '../../views/statisticsOptions.html',
              controller: 'StatisticsOptionsCtrl',
              resolve: {
              }
          });

          optionsModal.result.then(function (view) {
              $scope.statisticsView = view;                
          });
      }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:StatisticsoptionsCtrl
 * @description
 * # StatisticsoptionsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('StatisticsOptionsCtrl', ['$scope', '$uibModalInstance', 'ServerData',
  	function ($scope, $uibModalInstance, ServerData) {
    	
    	ServerData.config.get().then(function(config){
	        $scope.options = config.statisticsViews;  
	    });

	    $scope.selectOption = function(option){
	    	$uibModalInstance.close(option.view);
	    }
  }]);


'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:checkImage
 * @description
 * # checkImage
 */
angular.module('tunariApp')
  .directive('checkImage', ['$http', 'Config', function ($http, Config) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            $http.get(attrs.checkImage).then(function(){
                element.attr('src', attrs.checkImage);
            }, function() {
                //element.attr('src', Config.tunariApi + "/images/" + "notFound.gif"); // set default image
            });           
        }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:prodQuantityChart
 * @description
 * # prodQuantity
 */
angular.module('tunariApp')
  .directive('productQuantityChart', ["ServerData", function (ServerData) {

  	var margin = {top: 70, right: 10, bottom: 100, left: 60};
	var	height = height = 500 - margin.top - margin.bottom;
	var spaceBetweenBars = 10;	

    return {
      restrict: 'E',
      scope: {
      	titleText: '=',
  	    data: '=',
  	    barsColor: '='
      },
      link: function postLink(scope, element, attrs) {
      		
  			var width = $("#chart").width() - margin.left - margin.right;

			$(window).resize(function() {
				var newWidth = $("#chart").width() - margin.left - margin.right;
				if(newWidth>0 && width!= newWidth){
			  		width = newWidth;					
			  		repaint(scope.data); 
				}				
			});

			var vis = d3.select(element[0])
                .append("svg")
                .attr("class", "svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   			
                
            scope.$watch('data', function (newVal, oldVal) {     
            	repaint(newVal);    
            });

            var repaint = function(dataSet) {

				vis.selectAll('*').remove();

                if (!dataSet) {
                    return;
                }

				var dataLength = dataSet.length;
				var barWidth = width/dataLength;
				var maxValue = _.max(_.pluck(dataSet, 'quantity'));

                d3.select(element[0]).select("svg").attr("width", width + margin.left + margin.right);

                // Title
                vis.append("text")
			        .attr("x", (60))             
			        .attr("y", 0 - (margin.top / 2))
			        .attr("text-anchor", "middle")  
			        .style("font-size", "32px") 
			        .style("text-decoration", "underline")  
			        .text(scope.titleText);

	        	// Y Axis Label
			  	vis.append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", - margin.left)
			      .attr("x", - (height/2))
			      .attr("dy", "1em")
			      .style("font-size", "15px") 
			      .style("text-anchor", "middle")
			      .text("Cantidad en el Depósito");

		        // Axis
                var xScale = d3.scale.ordinal()
                	.domain(dataSet.map(function(d) { return d.name; }))
				    .rangeBands([0, width]);

				var yScale = d3.scale.linear()
				    .domain([0, maxValue])
				    .range([height, 0]);

			    var xAxis = d3.svg.axis()
				    .scale(xScale)
				    .orient("bottom")
				    .innerTickSize(-height)
				    .tickPadding(10);
				
				var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left")
				    .innerTickSize(-width)
				    .tickPadding(10);

			    vis.append("g")
					.attr("class", "x axis")					
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
						.selectAll("text")  
					     .style("text-anchor", "end")
					     .attr("dx", "-.8em")
					     .attr("dy", ".15em")
					     .attr("transform", "rotate(-65)");

				vis.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				// Real Quantities at the top of the bars
			    vis.selectAll("text.bar")
				  .data(dataSet)
				  .enter().append("text")
				  .attr("class", "bar")
				  .attr("text-anchor", "middle")
				  .attr("x", function(d) { return xScale(d.name) + (width/dataLength)/2 })
				  .attr("y", height-5)
				  .text(function(d) { return d.quantity; })
				  .transition()
				  .delay(function(d, i) { return i * 100; })
				  .attr("y", function(d){return yScale(d.quantity) - 10});	
				  	
			    // Tooltips
			    // Different position for the first bar because it is 
			    // not displayed nice in small screens
                var tip = d3.tip()
				  .attr('class', 'well well-lg')
				  .offset(function(d,i) {
					  if(i == 0 && dataSet.length>1) return [0, 0]
					  return [0, -40]
				     })
				  .direction('w')
				  tip.direction(function(d,i) {
					  if(i == 0 && dataSet.length>1) return 'e'
					  return 'n'
				     }
				  )
				  .html(function(d) {
				    return "<div class='col-xs-12'>" +
					    		"<div class='col-xs-7'>" +
						    		"<img class='img-responsive' src='" +
						    		ServerData.urlImages + "/" + d.category + "/" +
						    		d.properties.type + "/" + d.name +"-S.jpg"+"'>" +
									"</img>" + 
					    		"</div>" +
					    		"<div class='col-xs-5'>" +
						    		"<strong>Producto:</strong> <span>" + d.name + "</span></br>" +
						    		"<strong>Cantidad:</strong> <span>" + d.quantity + "</span>"+
					    		"</div>" +
				    		"</div>";
				  });

				vis.call(tip);  
				
                // Bars
                var bars = vis.selectAll("g.bar")
	                .data(dataSet)
	                .enter().append("g")
	                .style("fill", scope.barsColor)
	                .style("fill-opacity", 0.7)
	                .style("stroke","black")
	                .style("stroke-width", 3)
	                .attr("class", "bar")
	                .attr("transform", function(d, i) {
	                    return "translate(" + (i * barWidth + spaceBetweenBars/2) + ",0)";
	                })
	                .on('mouseover', tip.show)
      				.on('mouseout', tip.hide);

                bars.append("rect")
	                .attr("width", barWidth - spaceBetweenBars)
	                .attr("x", 0)
	                .attr("y", height)
	                .attr("rx", 5)
	                .attr("height", 0)
	                .transition()
	                .delay(function(d, i) { return i * 100; })
	                .attr("y", function(d){return yScale(d.quantity)})
	                .attr("height", function(d){return d.quantity*height/maxValue});
            } //resize
      } // link  
    }; // return
}]); //directive

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:productLocation
 * @description
 * # productLocation
 */
angular.module('tunariApp')
  .directive('productlocation', function () {
    return {
      require: 'ngModel', 
      restrict: 'EA',
      link: function postLink(scope, element, attrs, ctrl) {
        
        ctrl.$parsers.push(function(value){
            var result = value;

            var reg = /^d(\w) e(\d+) p(\d+)$/;
            var match = value.match(reg);

            if(match){                  
                result = "Deposito " + match[1].toUpperCase() +
                         ", Estante " + match[2] + 
                         ", Peldaño " + match[3];
            }

            return result
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:sellingquantity
 * @description
 * # sellingquantity
 */
angular.module('tunariApp')
  .directive('sellingquantity', function () {
    return {
      require: 'ngModel',    
      restrict: 'EA',
      scope: {
          maxQuantity : '@'
      },
      link: function postLink(scope, element, attrs, ctrl) {
        ctrl.$parsers.push(function(value){
            
            var result = value;
            
            var reg = /^(\d+)[ #\*](\d+)$|(^\d+)$/;
            var match = value.match(reg);
            
            if(match){                
                if(match[1] && match[2]){   
                    result = (parseInt(match[1])*100) + parseInt(match[2]);                          
                }
                else if(match && match[3]){
                    result = parseInt(match[3]);
                }

                // Validates max value
                if(result > scope.maxQuantity){  
                    ctrl.$setValidity('max_quantity', false);
                    result = undefined;
                }
                else{
                    ctrl.$setValidity('max_quantity', true);
                } 
            }
                
            return result;
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:sellingsBarChart
 * @description
 * # sellingsBarChart
 */
angular.module('tunariApp')
  .directive('sellingsBarChart', ['ServerData', function (ServerData) {

    var margin =  { top: 20, right: 20, bottom: 100, left: 40 };
    var height = 500 - margin.top - margin.bottom;
    var spaceBetweenBars = 5;  
    var color = d3.scale.category20();
    var tooltipFormatDate = "dddd, MMMM DD YYYY HH:mm:ss";
    var groupingFormatDate = "YYYY-MM";

    return {
      restrict: 'E',
      scope: {      	
    	data: '='  	    
      },
      link: function postLink(scope, element, attrs) {

        var width = $("#sellings-bar-chart").width() - margin.left - margin.right;
        var legendNames;
        var interval;
        var parseDate;

        var xScale = d3.time.scale();
        var yScale = d3.scale.linear()
                      .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .innerTickSize(-height)
                      .ticks(4);
        var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left");        

        var svg = d3.select(element[0])
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)

        var mainVis = svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var legendsVis = d3.selectAll("#selling-legends")


        $(window).resize(function() {
            var newWidth = $("#sellings-bar-chart").width() - margin.left - margin.right;

            // Repaint just if width has changed
            if(newWidth>0 && width!= newWidth){
                width = newWidth;         
                repaint(scope.data); 
            }       
        });
      
        scope.$watch('data', function (newVal, oldVal) { 
            repaint(newVal);    
        });

        function repaint(data) {        
            mainVis.selectAll('*').remove();
            legendsVis.selectAll('*').remove();

            d3.select(element[0]).select("svg").attr("width", width + margin.left + margin.right);

            mainVis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", - margin.left)
            .attr("x", - (height/2))
            .attr("dy", "1em")
            .style("font-size", "15px") 
            .style("text-anchor", "middle")
            .text("Total [Bs]");

            setUpGlobalChartVariables(data);
            var dataSet = formatData(data);
            var barWidth = getBarWidth(dataSet);           

            // Legends
            var legends = legendsVis
              .append("svg")
                .attr("height", dataSet.length*50)            
              .selectAll(".legend")
              .data(legendNames)
              .enter()
              .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(5," + i * 37 + ")"; })
    
            // Legends colors
            legends
            .append("rect")
              .attr("x", 0)
              .attr("width", 50)
              .attr("height", 35)
              .style("fill-opacity", 0.7)
              .attr("rx", 5)
              .style("fill", function(d, i){return color(d);})

            // Legends texts
            legends
            .append("text")
                .attr("x", 51)
                .attr("y", function(d, i) {return 18+0.1*i})
                .text(function(d){return d;})


            xScale.range([barWidth/2, width-barWidth/2])
              .domain(d3.extent(dataSet, function(d) { return parseDate(d.roundedDate); }));
            yScale.domain([0, d3.max(dataSet, function(d) { return d.y1; })]);

            yAxis.innerTickSize(-width)

            mainVis.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
            mainVis.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            // Tooltips
            var tip = d3.tip()
              .attr('class', 'well well-lg')
              .html(function(d) {
                return "<div class='col-xs-12'>" +
                      "<div class='col-xs-7'>" +
                        "<img class='img-responsive' src='" +
                        ServerData.urlImages + "/" + d.product.category + "/" +
                        (d.product.properties.type||"") + "/" + d.product.name +"-S.jpg"+"'>" +
                      "</img>" + 
                      "</div>" +
                      "<div class='col-xs-5'>" +
                        "<strong>Producto:</strong> <span>" + d.product.name + "</span></br>" +
                        "<strong>Total:</strong> <span>" + d.total + "</span></br>"+
                        "<strong>Fecha:</strong> <span>" + d.date.format(tooltipFormatDate) + "</span>"+
                      "</div>" +
                    "</div>";
              });

            mainVis.call(tip);  

            // Bars
            mainVis
            .append("g")
              .attr("class", "bars")
            .selectAll(".bar.stack")
            .data(dataSet)
            .enter()
            .append("g")
              .attr("class", "bar stack")
              .style("stroke","black")
              .style("stroke-width", 2)
              .style("fill-opacity", 0.7)
              .attr("transform", function(d) { return "translate(" + (xScale(parseDate(d.roundedDate)) - barWidth/2 + spaceBetweenBars/2) + ",0)"; })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
            .append("rect")
              .attr("class", "bar")
              .attr("width", barWidth-spaceBetweenBars)
              .attr("y", height)
              .attr("height", 0)
              .style("fill", function(d, i) { return color(d.product.name); })
              .transition()
                .delay(function(d, i) { return 70; })
                .attr("y", function(d){return yScale(d.y1)})
                .attr("height", function(d){return yScale(d.y0) - yScale(d.y1);});

            mainVis.selectAll('.axis line, .axis path')
             .style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '0.5px'});                
        }

        // Set up general variables based in how the sellings will be stacked
        // by month, day or hour
        function setUpGlobalChartVariables(data) {
          var dateRange = moment(data[0].date).diff(moment(data[data.length-1].date));

          //by hour
          if(dateRange < 86400000) {
                parseDate = d3.time.format("%Y-%m-%d %H").parse;                  
                groupingFormatDate = "YYYY-MM-DD HH";
                interval = 'hour';
            } 
            // by day
            else if(dateRange < 2678400000){
                parseDate = d3.time.format("%Y-%m-%d").parse;                  
                groupingFormatDate = "YYYY-MM-DD";
                interval = 'day';
            }    
            // by month          
            else {
                parseDate = d3.time.format("%Y-%m").parse;                  
                groupingFormatDate = "YYYY-MM";
                interval = 'month';
            }  
        }

        function formatData(data) {
            var dataSet = getSellingsForTopProducts(data);
            
            legendNames = _.uniq(_.pluck(dataSet, "product[0].name"));

            dataSet = groupDataByDate(dataSet);            

            return dataSet;
        }

        // Get the sellings for the top 20 products
        function getSellingsForTopProducts(data) {
            var sellingsForTopProducts = _.chain(data).groupBy(function(d) {
                return d.product[0].name
            })
            .mapValues(function(d) {
                return {
                  total: _.sum(d, function(d) {return d.total;}),
                  sellings: d
                };
            })
            .sortBy(function(d) { return -d.total})
            .take(20)
            .pluck("sellings")
            .flatten()
            .value();            

            return sellingsForTopProducts;
        }

        // Group sellings for date to be able to
        // create the stacked bar charts
        function groupDataByDate(data) {

            var sortedData = _.sortBy(data, function(n) {
                return n.date;
            });

            var groupedSellings = _.groupBy(sortedData, function(element){
                return moment(element.date).format(groupingFormatDate);
            });

            
            var result = [];
            var keyDates = _.keys(groupedSellings);
            _.each(keyDates, function(date) {
                
                var y0 = 0;
                var sellingsForDate = groupedSellings[date];
                _.each(sellingsForDate, function(selling) {
                      
                      result.push({
                          roundedDate: date,
                          date: moment(selling.date),
                          product: selling.product[0],
                          y0: y0,
                          y1: y0 += selling.total,
                          total: selling.total
                      });
                });
            });

            return result;
        }

        // Calculates the the width of the bars
        // based on the interval that is based on how
        // the data is stacked (by month, day or hour)
        function getBarWidth(dataSet) {
            var minDate = dataSet[0].date.clone().startOf(interval);
            var maxDate = dataSet[dataSet.length-1].date.clone().startOf(interval);
            var numberOfBars = maxDate.diff(minDate, interval) + 1;

            var barWidth = width/numberOfBars;

            return barWidth;
        }
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:datepicker
 * @description
 * # datepicker
 */
angular.module('tunariApp')
  .directive('sellingsDatepicker', function () {
    return {
      templateUrl: '../../views/sellingsDatepicker.html',
      restrict: 'E',
      scope: {
          from: '=',
          to: '=',
          format: '='
      },  
      link: function postLink(scope, element, attrs) {               

	    scope.status = {
	    	from: {
	      		opened: false	    		
	    	},
	    	to: {
	      		opened: false	    		
	    	}
	    };

	    scope.openFrom = function($event) {
	      	scope.status.from.opened = true;
	    };

	    scope.openTo = function($event) {
	      	scope.status.to.opened = true;
	    };
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:shoppingcart
 * @description
 * # shoppingcart
 */
angular.module('tunariApp')
  .directive('shoppingcart', function () {
    
    var controller = ['$scope', 'Sellings', 'Notifier', 'Messages', '$uibModal', 'ServerData',
      function($scope, Sellings, Notifier, Messages, $uibModal, ServerData){                              

        $scope.serverData = ServerData;

        $scope.selling = {
            sellingItems: $scope.sellingItems,
        };

        $scope.getTotalRevenue = function(){           
            var result = _.sum($scope.sellingItems, function(sellingItem){
                return sellingItem.revenue;
            });

            return _.round(result, 2);
        };
        
        $scope.getTotal = function(){
            var result = _.sum($scope.sellingItems, function(sellingItem){
                return sellingItem.total;
            });

            return _.round(result, 2);
        };
                
        $scope.showSelling = function(sellingItem) {
            var sellingItemModal = $uibModal.open({
              templateUrl: '../../views/sellingItem.html',
              controller: 'sellingItemCtrl',
              size:'lg',
              resolve: {
                sellingItem: function () {
                  return sellingItem;
                }
              }
            });

            sellingItemModal.result.then(function(updatedSellingItem) {
                var iSelling = $scope.sellingItems.indexOf(sellingItem);
                $scope.sellingItems[iSelling] = updatedSellingItem;
            }); 
        };

        $scope.saveSelling = function () {   

            $('#shoppingcartbody').collapse('hide');

            if($scope.sellingItems.length <= 0) {
                Notifier({ 
                    message: Messages.message016,
                    classes: 'alert-warning'
                }); 
                return; 
            }

            // Add client to the selling
            if($scope.client){                
                $scope.selling.client = $scope.client
            }
            else{
                $scope.selling.client = {
                    name:"Desconocido",
                    address:"Desconocido",
                    phone:"9999999"
                };
            }

            $scope.selling.sellingItems = $scope.sellingItems,
            $scope.selling.total = $scope.getTotal();
            $scope.selling.revenue = $scope.getTotalRevenue();

            _.each($scope.selling.sellingItems, function(sellingItem){
                var newProductQuantity = sellingItem.product.quantity-sellingItem.quantity;
                sellingItem.product.quantity = newProductQuantity;
                sellingItem.product.put();
            });

            Sellings.post($scope.selling).then(function(){
                $scope.sellingItems = [];

                Notifier({ 
                    message: Messages.message007,
                    classes: 'alert-info'
                }); 
            });                                     
        };
        
        $scope.cleanSelling = function() {
            $('#shoppingcartbody').collapse('hide');
            $scope.sellingItems = [];
        }
        
        $('.shopping-cart-body').css('max-height',$(window).height()/2.5);
        
    }];
    
    return {
      templateUrl: '../../views/shoppingcart.html',
      restrict: 'EA',
      scope: {
          sellingItems: '='
      },    
      controller: controller
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:tagsproduct
 * @description
 * # tagsproduct
 */
angular.module('tunariApp')
  .directive('tagsproduct', function () {
    return {
      require: 'ngModel',          
      restrict: 'EA',
      link: function postLink(scope, element, attrs, ctrl) {
        
          ctrl.$formatters.push(function(value){
              var result = value;
              if(result){                  
                result = value.join(" ");
              }
              
              return result
          });
          
          ctrl.$parsers.push(function(value){
              var result = value;
              if(result){                  
                result = value.split(" ");
              }
              
              return result
          });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:typehead
 * @description
 * # typehead
 */
angular.module('tunariApp')
  .directive('typeahead', function () {
     var controller = ['$scope', 'Sellings', 'Clients', function($scope, Sellings, Clients){
        var items = new Bloodhound({
            datumTokenizer: function() {},
            queryTokenizer: Bloodhound.tokenizers.whitespace,
        }); 


        $scope.exampleData = {
            displayKey: 'name',
            source: items.ttAdapter()
        };

        $scope.exampleOptions = {
            highlight: true
        };

        Clients.getList().then(function(clients) {      

            items = new Bloodhound({
                datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local:clients
            }); 

            items.initialize();

            $scope.exampleData = {
                displayKey: 'name',
                source: items.ttAdapter()
            };
        });



        $scope.client = null;
     }];
    return {
      template: '<input placeholder="Cliente..." class="typeahead sfTypeahead form-control" options="exampleOptions" datasets="exampleData" \
        ng-model="client"/>',
        scope:{
        client:"="
        },
      restrict: 'EA',        
      controller: controller,
//      replace: true, 
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:uppercase
 * @description
 * # uppercase
 */
angular.module('tunariApp')
  .directive('uppercase', function () {
    return {
      require: 'ngModel', 
      restrict: 'EA',
      link: function postLink(scope, element, attrs, ctrl) {
        ctrl.$parsers.push(function(value){
            var result = value.toUpperCase();
            return result;
        });
      }
    };
  });


'use strict';

/**
 * @ngdoc filter
 * @name clientApp.filter:checkedProduct
 * @function
 * @description
 * # checkedProduct
 * Filter in the clientApp.
 */
angular.module('tunariApp')
  .filter('checkedProduct', function () {    
    
    return function (input, client, filter) {
        
        var out = [];
        
        
        angular.forEach(input, function(product) {
            
            var isDistributed = _.some(client.productSamples, function(sample){
                return sample == product.name;
            });
            
            var result = true;
            if(filter == "Repartidos"){
                if(isDistributed){
                    
                    out.push(product);
                }
            }
            else if(filter == "No Repartidos"){
                if(!isDistributed){
                    
                    out.push(product);
                }
            }
            else{
                out.push(product);
            }

            
        });
      return out;
    };
  });


'use strict';

/**
 * @ngdoc service
 * @name clientApp.clients
 * @description
 * # clients
 * Service in the clientApp.
 */
angular.module('tunariApp')
  .service('Clients', ['Restangular', function (Restangular) {
    return Restangular.service('clients');
  }]);

'use strict';

/**
 * @ngdoc service
 * @name clientApp.messages
 * @description
 * # messages
 * Constant in the clientApp.
 */
angular.module('tunariApp')
  .constant('Messages', {
      message001: 'Felicidades!, Ha creado el cliente ',
      message002: 'Felicidades!, Ha creado el producto ',
      message003: 'Ha modificado satisfactoriamente el cliente ',
      message004: 'Ha modificado satisfactoriamente el producto ',
      message005: 'Ha eliminado el cliente ',
      message006: 'El producto ha sido elminado!',
      message007: 'Venta Exitosa!',
      message008: 'Eliminar Cliente',
      message009: 'Esta seguro de elminar el cliente ',
      message010: 'Eliminar Producto',
      message011: 'Esta seguro de elminar el producto ',
      message012: 'Nueva cantidad del producto ',
      message013: 'La cantidad no es correcta.',
      message014: 'Introduzca la cantidad por favor.',
      message015: 'Unidades.',
      message016: 'No hay productos en el carrito!, añada uno con los botones verdes.',
      message017: 'Ya existe un producto <%= product %> en el carrito!, por favor modifique el que ya existe',
      message018: 'El producto <%= product %> ya existe en la base de datos, por favor utilize otro nombre',
      message019: 'Hubo un problema con el servidor por favor contactese con su proveedor'
  })

'use strict';

/**
 * @ngdoc service
 * @name clientApp.notifier
 * @description
 * # notifier
 * Factory in the clientApp.
 */
angular.module('tunariApp')
  .factory('Notifier', ['notify', function (notify) {
    
    notify.config({
      duration:3000      
    });
    
    return notify;    
  }]);

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
'use strict';

/**
 * @ngdoc service
 * @name clientApp.Products
 * @description
 * # Products
 * Factory in the clientApp.
 */
angular.module('tunariApp')
  .factory('Products', ['Restangular', function (Restangular) {
    return Restangular.service('products');
    
//    return Restangular.withConfig(function(RestangularConfigurer) {
//        RestangularConfigurer.setResponseExtractor(function(response, operation, what, url) {
//            if (operation === "getList") {                
//                _.each(response,function(product){
//                    product.tags = product.tags.join(" ");
//                });
//            }
//            else{
//                response.tags = response.tags.join(" ");
//            }
//            
//            return response;
//        });
//      }).service('products');
    
  }]);

'use strict';

/**
 * @ngdoc service
 * @name clientApp.search
 * @description
 * # search
 * Service in the clientApp.
 */
angular.module('tunariApp')
  .service('SearchInfo', function () {
    
    this.tags = "";

    this.getTags = function(){
    	return this.tags;
    }

    this.setTags = function(tags){
    	this.tags = tags;
    }

  });

'use strict';

/**
 * @ngdoc service
 * @name clientApp.sellingItemInfo
 * @description
 * # sellingItemInfo
 * Service in the clientApp.
 */
angular.module('tunariApp')
  .service('SellingItemInfo', [function () {
    
    this.updateProperties = function(sellingItem) { 
	  var pricePerUnity = sellingItem.productPrice.type != 'Unidad' ?
	                      sellingItem.productPrice.value / sellingItem.product.properties.quantityPerPackage :
	                      sellingItem.productPrice.value;

	  sellingItem.total = sellingItem.quantity * pricePerUnity;
	  sellingItem.total = parseFloat(sellingItem.total.toFixed(1));
	  this.updateRevenue(sellingItem);
	}

	this.updateRevenue = function(sellingItem) {
	  var pricePerUnity = sellingItem.productPrice.type != 'Unidad' ?
	                    sellingItem.productPrice.value / sellingItem.product.properties.quantityPerPackage :
	                    sellingItem.productPrice.value;

	  var buyingPricePerUnity = sellingItem.product.buyingPrice.type != 'Unidad' ?
	                    sellingItem.product.buyingPrice.value / sellingItem.product.properties.quantityPerPackage :
	                    sellingItem.product.buyingPrice.value;

	  sellingItem.revenue = sellingItem.total -
      sellingItem.quantity * buyingPricePerUnity;
	  sellingItem.revenue = parseFloat(sellingItem.revenue.toFixed(1));
	}
  }]);

'use strict';

/**
 * @ngdoc service
 * @name clientApp.sellings
 * @description
 * # sellings
 * Service in the clientApp.
 */
angular.module('tunariApp')
  .service('Sellings', ['Restangular', function (Restangular) {
    return Restangular.service('sellings');
  }]);

'use strict';

/**
 * @ngdoc service
 * @name clientApp.serverData
 * @description
 * # serverData
 * Service in the clientApp.
 */
angular.module('tunariApp')
  .service('ServerData', ['Config', 'Restangular',
    function (Config, Restangular) {

        this.config = Restangular.oneUrl('config', Config.tunariApi + '/api/config');      

        this.urlImages = Config.tunariApi + "/images/";
  }]);



'use strict';

/**
 * @ngdoc service
 * @name tunariApp.settings
 * @description
 * # settings
 * Service in the tunariApp.
 */
angular.module('tunariApp')
  .service('Settings', ['Restangular', function (Restangular) {
    return Restangular.service('settings');
  }]);

'use strict';

/**
 * @ngdoc service
 * @name clientApp.SpeechRecognition
 * @description
 * # SpeechRecognition
 * Factory in the clientApp.
 */
angular.module('tunariApp')
  .factory('SpeechRecognition', ['$window', function ($window) {
    
    var observerOnResultCallbacks = [];
    var observerOnFinalResultCallbacks = [];

    var SpeechRecognition = $window.SpeechRecognition || $window.webkitSpeechRecognition;

    var recognizer;
    var isRecognizing = false;
    var transcript = "";

    var service = {
        startRecognition: startRecognition,
        stopRecognition: stopRecognition,
        getTranscript: function () {
            return transcript;
        },
        registirObserverOnResultCallback: function(callback) {
            observerOnResultCallbacks.push(callback);
        },
        registirObserverOnFinalResultCallback: function (callback) {
            observerOnFinalResultCallbacks.push(callback);
        }
    };

    activate();

    function notifyOnResultObservers(){
      angular.forEach(observerOnResultCallbacks, function(callback){
            callback();
      });
    };

    function notifyOnFinalResultObservers(finalResult){
      angular.forEach(observerOnFinalResultCallbacks, function(callback){
            callback(finalResult);
      });
    };

    function activate() {
        if (SpeechRecognition) {
            recognizer = new SpeechRecognition();

            recognizer.maxAlternatives = 3;
            recognizer.interimResults = true;

            recognizer.onstart = startHandler;
            recognizer.onend = endHandler;
            recognizer.onresult = resultHandler;
        }
    }

    function getTranscript () {
        return transcript;
    }

    function resultHandler(event) {
        if (event.results) {
            var result = event.results[event.resultIndex];

            transcript = result[0].transcript;
            notifyOnResultObservers();

            if(result.isFinal) {
                notifyOnFinalResultObservers(transcript);
                console.log ("Final result: " + transcript)
            }
            else
            {
                console.log ("Interm result: " + transcript)
            }
        }
    }

    function startHandler() {
        isRecognizing = true;
    }

    function endHandler() {
        isRecognizing = false;
    }

    function startRecognition() {
        if(recognizer) {
            if(!isRecognizing) {
                recognizer.start();
            }
        }
        else
        {
            throw new Error('Speech recognition is not supported');
        }
    }

    function stopRecognition() {
        if(recognizer) {
            recognizer.stop();
        }
    }

    return service;
  }]);
