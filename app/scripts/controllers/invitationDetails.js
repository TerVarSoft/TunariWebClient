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
