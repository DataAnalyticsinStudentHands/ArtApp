'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
  'ngRoute',
  'publicArtControllers',
    'ngAnimate',
    'ui.router'
]);

publicArtApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
        .state('/',{
            url:'/',
            templateUrl: 'partials/body.html'
        })
        .state('compass',{
            url: '/compass',
            templateUrl: 'partials/compassMode.html'
        })
        .state('compass.map',{
            url: '/compass1',
            templateUrl: 'partials/map.html'
        })
        .state('compass.map.body',{
            url: '/compass2',
            templateUrl: 'partials/body.html'
        })
        .state('tours',{
            url: '/tours',
            templateUrl: 'partials/tourList.html'
        })
        .state('makeTour',{
            url: '/make',
            templateUrl: 'partials/makeTour.html'
        })
        .state('scavenger',{
            url: '/scav',
            templateUrl: 'partials/scavengerMode.html'
        })
        .state('info',{
            url: '/info',
            templateUrl: 'partials/moreInfo.html'
        });
}]);

//publicArtApp.config(['$routeProvider',
//    function($routeProvider) {
//    $routeProvider.
//        when('/home', {
//            templateUrl: 'partials/home.html',
//            controller: 'PhoneListCtrl'
//        }).
//        when('/compass', {
//            templateUrl: 'partials/compassMode.html',
//            controller: 'PhoneListCtrl'
//        }).
//        when('/tourList', {
//            templateUrl: 'partials/tourList.html',
//            controller: 'PhoneListCtrl'
//        }).
//        when('/makeTour', {
//            templateUrl: 'partials/makeTour.html',
//            controller: 'PhoneListCtrl'
//        }).
//        when('/scavenger', {
//            templateUrl: 'partials/scavengerMode.html',
//            controller: 'PhoneListCtrl'
//        }).
//        when('/info', {
//            templateUrl: 'partials/moreInfo.html',
//            controller: 'PhoneListCtrl'
//        }).
//        otherwise({
//            redirectTo: '/home'
//        });
//    }]);
