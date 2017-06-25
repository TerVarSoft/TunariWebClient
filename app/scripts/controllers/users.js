'use strict';

/**
 * @ngdoc function
 * @name tunariApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the tunariApp
 */
angular.module('tunariApp')
  .controller('UsersCtrl', ['$scope', '$location', '$mdDialog', 'Users', 'Messages' ,
    function ($scope, $location, $mdDialog, Users, Messages) {
      $scope.layout.title = 'Usuarios';
      $scope.layout.hideHeader = false;
      $scope.users = [];

      Users.getList().then(function(users) {
        $scope.users = users;
      });

      $scope.registerUser = function() {
        $location.path("/register");
      }

      $scope.removeUser = function(user) {
        var deleteUserModal = $mdDialog.confirm()
          .title('Esta seguro de borrar el usuario ' + user.name + "?")
          .textContent('El usuario seleccionado se borrara')
          .ariaLabel('Delete product')
          .targetEvent(event)
          .ok('Borralo!')
          .cancel('Cancelar');

        $mdDialog.show(deleteUserModal).then(function(){
            user.remove().then(function(){
                _.pull($scope.users, user);
                $scope.showToast(Messages.message020, user.name);
            }, function() {});
        }, function() {});
      }
}]);