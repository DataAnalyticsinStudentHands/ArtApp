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
            templateUrl:"partials/origin.html",
            stopWatches: true
        })
        .state('tours',{
            url:"/tours",
            templateUrl:"partials/tours.html",
            controller:"tourListCtrl",
            stopWatches: false
        })
        .state('explore',{
            url:"/explore",
            templateUrl:"partials/explore.html",
            controller:"exploreCtrl",
            stopWatches: true
            
        })
        .state('test',{
            url:"/test",
            templateUrl:"partials/test.html",
            controller:"testCtrl",
            stopWatches: false
        });
}]);

publicArtApp.run(['$rootScope', 
        function($rootScope){
            $rootScope.$on('$stateChangeStart', 
                           function(event, toState, toParams, fromState, fromParams){
                               console.log(fromState.name+"-------> Routing to ------>"+toState.name);
                           });
        }]);