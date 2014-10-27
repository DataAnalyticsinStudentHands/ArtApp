'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ionic',
    'controllerModule',
    'locationServicesModule',
    'snap',
    'ngSanitize'
]);


publicArtApp.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('ARtours',{
            url:"",
            views: {
                "tour": {
                    templateUrl:"partials/tours.html",
                    controller:"tourListCtrl"
                },
                "explore": {
                    templateUrl:"partials/explore.html",
                    controller:"exploreCtrl"
                }
               }
        })
        .state('search',{
            abstract:true,
            url:"/search",
            templateUrl:"partials/search.html",
            controller:"searchCtrl"
        })
        .state('search.artwork',{
            url:"/search/art",
            views:{
                "content":{
                    templateUrl:"partials/search.artwork.html"
                }
            }
        })
        .state('search.artist',{
            url:"/search/artist",
            views:{
                "content":{
                    templateUrl:"partials/search.artist.html"
                }
            }
        });
//        .state('tourExplore',{
//            url:"/tour/explore",
//            templateUrl:"partials/explore.html",
//            controller:"exploreCtrl"
//        });
}]);

publicArtApp.run(['$rootScope', '$http', '$ionicPlatform',
        function($rootScope, $http, $ionicPlatform){
            
            
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

            
            
            
            
            /*Reads tour.json and set data into localstorage only if there is new version*/
            if (localStorage.getItem("tours_version")!="1.0") {
                $http.get('tours.json').success(function(data) {
                    localStorage.setItem("tours_version","1.1");
                    localStorage.setItem("tours",JSON.stringify(data));
                    console.log("...localstorage (tour.json) success...");
                });
            }
            
            /*Reads artwork.json and set data into localstorage only if there is new version*/
            if (localStorage.getItem("tours_version")!="1.0") {
                  $http.get('artwork.json').success(function(data) {
                    localStorage.setItem("artwork_version","1.1");
                    localStorage.setItem("artwork",JSON.stringify(data));
                    console.log("...localstorage (artwork.json) success...");
                });
            }
            
            /*Resets favorites each time app is opened for testing purposes*/
            localStorage.removeItem("favorites");
            
            /*Variables that control whether an artworks profile page should have its favorite(heart)/focus(plus sign) toggled on or off. Default is off*/
            $rootScope.favActive = false;
            $rootScope.addActive = false;
            /*This will be the variable indicating whether any pieces have been focused*/
            $rootScope.focus = false;
            /*When navigating to explore mode from the tour page this will be true to indicate that only tourPieces should be displayed in explore mode*/
            $rootScope.showTour = false;
            /*Will hold the artwork id's for the selected tour when user clicks start tour in the tours section of the app*/
            $rootScope.tourPieces = null;
            
            
            /*Given artwork id and state of the heart toggle button either the id is added into the list of localstorage favorites or the id is removed from the list of favorites*/
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
            
            /*Given an artwork id the function returns true or false whether the artwork is stored as a favorite in local storage*/
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
            
            /*Given artwork id and state of the focus toggle button either the id is added into the array focusedArt or the id is removed from focusedArt*/
            $rootScope.focusedArt = [];
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
            
            /*Given an artwork id the function returns true or false whether the artwork is stored as a focused artwork in focusedArt*/
            $rootScope.isFocused = function(id) {
                for(var q=0; q<$rootScope.focusedArt.length;q++) {
                    if ($rootScope.focusedArt[q]==id){
                       return true; 
                    }
                }
                return false;
            };
            
            /*Returns true or false for whether there is any artwork that is focused*/
            $rootScope.someFocus = function() {
                if ($rootScope.focusedArt.length>0){
                    return true;
                }else{
                    return false;
                }
            };
            
            /*Deletes all focused art id's from the array focusedArt*/
            $rootScope.clearFocus = function() {
                $rootScope.focusedArt = [];
                $rootScope.focus = false;
            };
            
            
        }]);