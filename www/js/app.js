'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ui.router',
    'controllerModule',
    'locationServicesModule',
    'snap',
    'ngSanitize'
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
            abstract:true,
            url:"/search",
            templateUrl:"partials/search.html",
            controller:"searchCtrl"
            
        })
        .state('search.artwork',{
            url:"/search/art",
            views:{"content":{templateUrl:"partials/search.artwork.html"}}
            
        })
        .state('search.artist',{
            url:"/search/artist",
            views:{"content":{templateUrl:"partials/search.artist.html"}}
            
        })
        .state('tourExplore',{
            url:"/tour/expore",
            templateUrl:"partials/explore.html",
            controller:"exploreCtrl"
        });
}]);

publicArtApp.run(['$rootScope', '$http',
        function($rootScope, $http){
            /*$rootScope.$on('$stateChangeStart', 
                           function(event, toState, toParams, fromState, fromParams){
                               console.log(fromState.name+"-------> Routing to ------>"+toState.name);
                           });*/
            
            if (localStorage.getItem("tours_version")!="1.0") {
                $http.get('tours.json').success(function(data) {
                    localStorage.setItem("tours_version","1.1");
                    localStorage.setItem("tours",JSON.stringify(data));
                    console.log("...localstorage (tour.json) sucess...");
                });
            }
            
            if (localStorage.getItem("tours_version")!="1.0") {
                  $http.get('artwork.json').success(function(data) {
                    localStorage.setItem("artwork_version","1.1");
                    localStorage.setItem("artwork",JSON.stringify(data));
                    console.log("...localstorage (artwork.json) sucess...");
                });
            }
            
            localStorage.removeItem("favorites");
            $rootScope.favActive = false;
            $rootScope.favorite = function (id,toggle) {
                var temp = [];
                if (localStorage.getItem("favorites")!=null) {
                    temp = JSON.parse(localStorage.getItem("favorites"));
                } 
                
                if (toggle){
                    console.log("add favorite: "+id);
                    temp.push(id);
                }else{
                    console.log("remove favorite: "+id);
                    var index = temp.indexOf(id);
                    if (index > -1) {
                        temp.splice(index, 1);
                    }
                }
                
                console.log(temp);
                localStorage.setItem("favorites",JSON.stringify(temp));
            };
            
            $rootScope.isFavorite = function (id) {
                var temp = [];
                if (localStorage.getItem("favorites")!=null) {
                    temp = JSON.parse(localStorage.getItem("favorites"));
                }
                
                for(var q=0; q<temp.length;q++) {
                    if (temp[q]==id){
                       return true; 
                    }
                }
                return false;
            };
            
            $rootScope.addActive = false;
            $rootScope.focusedArt = [];
            $rootScope.focus = false;
            $rootScope.focusArt = function(id, toggle) {
                if (toggle){
                    $rootScope.focusedArt.push(id);
                }else{
                    var index = $rootScope.focusedArt.indexOf(id);
                    if (index > -1) {
                        $rootScope.focusedArt.splice(index, 1);
                    }
                }
                console.log("focused: "+$rootScope.focusedArt);
            };
            
            $rootScope.isFocused = function(id) {
                for(var q=0; q<$rootScope.focusedArt.length;q++) {
                    if ($rootScope.focusedArt[q]==id){
                       return true; 
                    }
                }
                return false;
            };
            
            $rootScope.someFocus = function() {
                if ($rootScope.focusedArt.length>0){
                    return true;
                }else{
                    return false;
                }
            };
            
            $rootScope.clearFocus = function() {
                $rootScope.focusedArt = [];
                $rootScope.focus = false;
            };
            
            
            $rootScope.showTour = false;
            $rootScope.tourPieces = null;
            
        }]);