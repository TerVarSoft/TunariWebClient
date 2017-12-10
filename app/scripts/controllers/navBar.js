'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
    .controller('NavBarCtrl', ['$scope', '$location', '$mdSidenav', 'AuthToken', 'Config',
        function ($scope, $location, $mdSidenav, AuthToken, Config) {

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
                users: {
                    icon: 'group',
                    redirectTo: '/users',
                    propName: 'users',
                    text: 'Usuarios'
                },
                images: {
                    icon: 'photo_library',
                    redirectTo: '/images',
                    propName: 'images',
                    text: 'Monitor de Imagenes'
                }
            }

            if (Config.tunariChartsUrl) {
                $scope.menus.statistics = {
                    icon: 'insert_chart',
                    redirectTo: '/statistics',
                    propName: 'statistics',
                    text: 'Estadisticas'
                }
            }

            $scope.menus.settings = {
                icon: 'settings',
                redirectTo: '/settings',
                propName: 'settings',
                text: 'Configuraciones'
            }

            $scope.menus.logout = {
                icon: 'logout',
                redirectTo: '/logout',
                propName: 'logout',
                text: 'Salir'
            }

            $scope.changeView = function (menuItem) {
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
            $(".nav a").on("click", function () {
                $(".nav").find(".active").removeClass("active");
                $(this).parent().addClass("active");
            });
        }]);
