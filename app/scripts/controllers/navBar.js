'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('NavBarCtrl', ['$scope', '$location', '$mdSidenav', 'AuthToken', 
    function ($scope, $location, $mdSidenav, AuthToken) {
      	
    $scope.isUserAuthenticated = AuthToken.isAuthenticated;  
    $scope.getUserName = AuthToken.getUserFullName;    
 
    $scope.menus = {
    /*  shopping: {
        icon: 'dashboard',
        redirectTo: '/productSearch',
        subMenuView: 'views/productsSubMenu.html',
        propName: 'shopping',
        text: 'Ventas'
      },*/
      products: {
        icon: 'store',
        redirectTo: '/products',
        propName: 'products',
        text: 'Productos'
      },
      statistics: {
        icon: 'insert_chart',
        redirectTo: '/statistics',
        propName: 'statistics',
        text: 'Estadisticas'  			
      },
      settings: {
        icon: 'settings',
        redirectTo: '/settings',
        propName: 'settings',
        text: 'Configuraciones'
      },
      register: {
        icon: 'person_add',
        redirectTo: '/register',
        propName: 'register',
        text: 'Registrar usuario'
      },
      logout: {
        icon: 'logout',
        redirectTo: '/logout',
        propName: 'logout',
        text: 'Salir'
      }
      /*clients: {
        icon: 'people',
        redirectTo: '/clientSearch',  	
        subMenuView: 'views/clientsSubMenu.html',
        propName: 'clients',
        text: 'Clientes'		
      },*/      
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
