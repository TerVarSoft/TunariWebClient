'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:checkImage
 * @description
 * # checkImage
 */
angular.module('tunariApp')
  .directive('checkImage', ['$http', 'Config', 'AuthToken', 
    function ($http, Config, AuthToken) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                
                function revokeObjectURL() {
                    if ($scope.objectURL) {
                        URL.revokeObjectURL($scope.objectURL);
                    }
                }

                $scope.$watch('objectURL', function (objectURL) {
                    element.attr('src', objectURL);
                });

                $scope.$on('$destroy', function () {
                    revokeObjectURL();
                });

                attrs.$observe('checkImage', function (url) {

                    revokeObjectURL();

                    if(url && url.indexOf('data:') === 0) {
                        $scope.objectURL = url;
                    } else if(url) {
                        //$http.get(url, {
                         //   responseType: 'arraybuffer',
                         //   headers: {
                         //       'accept': 'image/webp,image/*,*/*;q=0.8',
                         //       'authorization': 'Bearer ' + AuthToken.getToken()
                         //   }
                        //})
                        $http.get(url, {
                            responseType: 'arraybuffer',
                            headers: {
                                'accept': 'image/webp,image/*,*/*;q=0.8'
                            }
                        }).then(function(response) {

                            var blob = new Blob(
                                [ response.data ], 
                                { type: response.headers('Content-Type') }
                            );
                            $scope.objectURL = URL.createObjectURL(blob);
                        }, function(response) {
                            if(response.status == 404) {
                                /**
                                 *   set default  image.
                                 */ 
                                element.attr('src', "/images/tunari-logo-1.png"); 
                            } else {
                                /**
                                 *   set default error image.
                                 */ 
                                element.attr('src', "/images/" + "imgServerError.gif"); 
                            }                
                        });           
                    }
                });
            }
        };
  }]);