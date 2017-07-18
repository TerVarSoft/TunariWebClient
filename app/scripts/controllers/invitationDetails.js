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
        $scope.$parent.product.properties.type = $scope.$parent.product.properties.type ||
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
}]);
