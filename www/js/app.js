'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ui.router',
    'controllerModule',
    'locationServicesModule',
    'snap'
]);


publicArtApp.config(['$stateProvider', function($stateProvider) {
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
            templateUrl:"partials/explore.html",
            controller:"exploreCtrl"
            
        })
        .state('search',{
            url:"/search",
            templateUrl:"partials/search.html"
            
        })
        .state('test',{
            url:"/test",
            templateUrl:"partials/test.html",
            controller:"testCtrl"
        });
}]);

publicArtApp.run(['$rootScope', 
        function($rootScope){
            $rootScope.$on('$stateChangeStart', 
                           function(event, toState, toParams, fromState, fromParams){
                               console.log(fromState.name+"-------> Routing to ------>"+toState.name);
                           });
        }]);