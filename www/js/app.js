'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ui.router',
    'controllerModule',
    'locationServicesModule',
    'MenuSlideout',
    'ngTouch'
]);


publicArtApp.config(['$stateProvider', function($stateProvider) {
    console.log('state changing');
    $stateProvider
        .state('index',{
            url:"",
            templateUrl:"tpl/body.html"
        })
        .state('tours',{
            url:"/tours",
            templateUrl:"tpl/tour.html",
            controller:"tourListCtrl"
        })
        .state('explore',{
            url:"/explore",
            templateUrl:"tpl/explore (2).html",
            controller:"exploreCtrl"
        });
}]);