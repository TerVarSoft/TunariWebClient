'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductquantitychartsCtrl
 * @description
 * # ProductquantitychartsCtrl
 * Controller of the clientApp
 */
angular.module('tunariApp')
  .controller('InvitationsQuantityChartsCtrl', ['$scope', 'Settings', 'Products',
    function ($scope, Settings, Products) {
    	        
        var invitationsPerChart = 8;

        Settings.getList().then(function(settings){
            $scope.invitationTypes = _.find(settings, {'key': 'invitationTypes'}).value;

	        var colors = ['#4089A1', '#7DAB6D', '#AB7A6A', '#C5CC7A', '#82698C', '#7C8087', '#8DC9C6', '#DB5353']
            //$scope.mappedColors = _.zipObject(_.zip($scope.invitationTypes, colors));  
            $scope.mappedColors = _.zipObject($scope.invitationTypes, colors);      
            console.log(_.zip($scope.invitationTypes, colors));

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
