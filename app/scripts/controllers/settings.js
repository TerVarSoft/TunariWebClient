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
            $scope.layout.hideHeader = false;

            Settings.getList().then(function (settings) {
                $scope.productCategories = _.find(settings, { 'key': 'productCategories' });
                initProductPrices();

                $scope.imgServer = _.find(settings, { 'key': 'imgServer' });
                $scope.sampleBookInterval = _.find(settings, { 'key': 'sampleBookInterval' });
                $scope.quickSearchs = _.find(settings, { 'key': 'quickSearchs' });
                $scope.excludeListForStatistics = _.find(settings, { 'key': 'excludeListForStatistics' });
                $scope.invitationTypes = _.find(settings, { 'key': 'invitationTypes' });

                if (!$scope.imgServer) {
                    Settings.post({ key: "imgServer", value: "" }).then(function (newSetting) {
                        $scope.imgServer = newSetting;
                    });
                }

                if (!$scope.sampleBookInterval) {
                    Settings.post({ key: "sampleBookInterval", value: 5000 }).then(function (newSetting) {
                        $scope.sampleBookInterval = newSetting;
                    });
                }

                if (!$scope.invitationTypes) {
                    Settings.post({ key: "invitationTypes", value: [] }).then(function (newSetting) {
                        $scope.invitationTypes = newSetting;
                    });
                }

                if (!$scope.quickSearchs) {
                    Settings.post({ key: "quickSearchs", value: [] }).then(function (newSetting) {
                        $scope.quickSearchs = newSetting;
                    });
                }

                if (!$scope.excludeListForStatistics) {
                    Settings.post({ key: "excludeListForStatistics", value: [] }).then(function (newSetting) {
                        $scope.excludeListForStatistics = newSetting;
                    });
                }

                if (!$scope.productCategories) {
                    Settings.post({ key: "productCategories", value: [] }).then(function (newSetting) {
                        $scope.productCategories = newSetting;
                    });
                }
            }, handleRequestError);

            $scope.testImgServer = function () {
                $window.location.href = $scope.imgServer.value + '/test.html?returnUrl=' + $location.absUrl();
            }

            $scope.saveSettings = function () {
                $scope.imgServer.save().then(function () {
                    ProductInfo.setImageServer($scope.imgServer.value);
                });
                $scope.sampleBookInterval.save().then(function () {
                    ProductInfo.setSampleBookInterval($scope.sampleBookInterval.value);
                });
                $scope.quickSearchs.save().then(function () {
                    ProductInfo.setProductQuickSearchs($scope.quickSearchs.value);
                });
                $scope.excludeListForStatistics.value = _.map($scope.excludeListForStatistics.value, _.toUpper)
                $scope.excludeListForStatistics.save();
                $scope.invitationTypes.save();
                saveProductCategories();

                $location.path('/products');
            }

            function initProductPrices() {
                _.each($scope.productCategories.value,
                    function(category) {
                        category.priceTypes = category.priceTypes ?
                            category.priceTypes
                            : [];
                        category.priceNames = _.map(category.priceTypes, "name");
                    });
            }

            function saveProductCategories() {
                _.each($scope.productCategories.value, function(category) {
                    category.priceTypes =
                        _.map(category.priceNames, function(priceName, index) {
                            return { id: index, name: priceName }
                        });
                    delete category.priceNames
                });
                $scope.productCategories.save().then(function() {
                    ProductInfo.setImageServer($scope.productCategories.value);
                });
            }

            function handleRequestError(response) {
                if (response.status == 401) {
                    console.log('Invalid jwt in local storage!, then redirecting to login');
                    $location.path("/login");
                }
            }
        }]);

