'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ui.router',
    'controllerModule',
    'locationServicesModule',
    'snap'
]);


publicArtApp.config(['$stateProvider', function($stateProvider) {
    console.log('state changing');
    $stateProvider
        .state('index',{
            url:"",
            templateUrl:"partials/origin.html"
        })
        .state('tours',{
            url:"/tours",
            templateUrl:"partials/tours.html",
            controller:"tourListCtrl"
        })
        .state('explore',{
            url:"/explore",
            templateUrl:"partials/ar.html",
            controller:"exploreCtrl"
        });
}]);