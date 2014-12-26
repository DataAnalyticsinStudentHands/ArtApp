'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ionic',
    'controllerModule',
    'ngSanitize',
    'restangular',
    'databaseServicesModule',
    'utilModule'
]);


publicArtApp.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/tour");
    $stateProvider
        .state('tour',{
            url:"/tour",
            views:{
                "menu":{
                    templateUrl:"partials/menu.html",
                    controller:"tourListCtrl"
                },
                "content":{
                    templateUrl:"partials/main.html",
                    controller:"mainCtrl"
                }
            }
        })
        .state('tour.imslide',{
            url:"/imslide/:tourID",
            views:{
                "content@":{
                    templateUrl:"partials/imageSlider.html",
                    controller:"imslideCtrl"
                }
            }
        })
        .state('tour.artDetail',{
            url:"/artDetail/:artID",
            views:{
                "content@":{
                    templateUrl:"partials/artworkDetail.html",
                    controller:"artDetailCtrl"
                }
            }
        })
}]);

publicArtApp.run(['$rootScope', '$http', 'Restangular', 'Auth', 'tourInfo', '$ionicSideMenuDelegate', '$timeout',
    function($rootScope, $http, Restangular, Auth, tourInfo, $ionicSideMenuDelegate, $timeout){
        //$ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        /* if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }*/
        // });
        $timeout(function() {
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft(); 
        }, 1000);
        
        Restangular.setBaseUrl("http://www.housuggest.org:8080/ArtApp/");

        Auth.setCredentials("Admin", "a91646d0a63e7511327e40cd2e31b297e8094e4f22e9c0a866549e4621bff8c190c71c7e9e9a9f40700209583130828f638247d6c080a67b865869ce902bb285");

        var loginResultPromise = Restangular.all("users").getList();

        loginResultPromise.then(function(result) {

            Auth.confirmCredentials();
            tourInfo.loadData();
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
        //            if (localStorage.getItem("tours_version")!="1.0") {
        //                  $http.get('artwork.json').success(function(data) {
        //                    localStorage.setItem("artwork_version","1.1");
        //                    localStorage.setItem("artwork",JSON.stringify(data));
        //                    console.log("...localstorage (artwork.json) success...");
        //                });
        //            }

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
    }]);