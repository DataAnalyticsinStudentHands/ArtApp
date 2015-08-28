'use strict';

/* App Module */
var publicArtApp = angular.module('publicArtApp', [
    'ionic',
    'controllerModule',
    'ngSanitize',
    'restangular',
    'databaseServicesModule',
    'utilModule',
    'adaptive.googlemaps',
    'ngNotify',
    'ImgCache',
    'ngCordova'
]);

publicArtApp.config(['$stateProvider','$urlRouterProvider', '$compileProvider','ImgCacheProvider',
    function($stateProvider,$urlRouterProvider,$compileProvider,ImgCacheProvider) {
        $urlRouterProvider.otherwise("/tour/collage/1");
        $stateProvider
            .state('tour',{
                url:"/tour",
                views: {
                    "menu": {
                        templateUrl:"partials/menu.html",
                        controller:"menuCtrl"
                    },
                    "content": {
                        templateUrl:"partials/main.html",
                        controller:"mainCtrl"
                    }
                }
            })
            .state('tour.collage', {
                url:"/collage/:tourID",
                views:{
                    "content@": {
                        templateUrl:"partials/collageView.html",
                        controller:"collageCtrl"
                    },
                },
                resolve: {
                    artworkIn: function(tourInfo) {
                        return tourInfo.loadArtwork();
                    },
                    toursIn: function(tourInfo) {
                        return tourInfo.loadTours();
                    }
                }
            })
            .state('tour.artDetail',{
                url:"/artDetail/:artID",
                views:{
                    "content@": {
                        templateUrl:"partials/artworkDetail.html",
                        controller:"artDetailCtrl"
                    }
                },
            resolve: {
                    artworkIn: function(tourInfo) {
                        return tourInfo.loadArtwork();
                    }
            }})
            .state('tour.favorites',{
                url:"/favorites",
                views:{
                    "content@":{
                        templateUrl:"partials/favorites.html",
                        controller:"favoriteCtrl"
                    }
                }
            })
            .state('tour.about',{
                url:"/about",
                views:{
                    "content@":{
                        templateUrl:"partials/about.html",
                        controller:"aboutCtrl"
                    }
                }
            })
            .state('tour.intro',{
                url:"/intro",
                views:{
                    "content@":{
                        templateUrl:"partials/intro.html",
                        controller:"introCtrl"
                    }
                }
            })
            .state('tour.error',{
                url:"/error",
                views:{
                    "content@":{
                        templateUrl:"partials/error.html",
                        controller:"errorCtrl"
                    }
                }
            });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo|maps):/);
        // or more options at once
        ImgCacheProvider.setOptions({
            debug: true,
            usePersistentCache: true
        });

        // ImgCache library is initialized automatically,
        // but set this option if you are using platform like Ionic -
        // in this case we need init imgcache.js manually after device is ready
        ImgCacheProvider.manualInit = true;        
    }]);

publicArtApp.run(['$rootScope', '$http', 'Restangular', 'Auth', 'tourInfo', '$ionicSideMenuDelegate','appStateStore','ngNotify','$ionicPlatform','ImgCache', '$state',
    function($rootScope, $http, Restangular, Auth, tourInfo, $ionicSideMenuDelegate,appStateStore,ngNotify,$ionicPlatform,ImgCache,$state){
        Restangular.setBaseUrl("https://www.housuggest.org:8443/ArtApp/");
//        Restangular.setBaseUrl("http://172.25.166.104:8080/ArtApp/");
        //Restangular.setBaseUrl("http://localhost:8080/ArtApp/");
        Restangular.setFullResponse(true);
        
        $rootScope.curState = 'none';
        $rootScope.prevState = 'none';
        
        $rootScope.goToLink = function(url){
            window.open(url,"_blank");
        }

        Auth.setCredentials("Admin", "a91646d0a63e7511327e40cd2e31b297e8094e4f22e9c0a866549e4621bff8c190c71c7e9e9a9f40700209583130828f638247d6c080a67b865869ce902bb285");

        var loginResultPromise = Restangular.all("users").getList();

        loginResultPromise.then(function(result) {
            Auth.confirmCredentials();
            // Load artwork and tours after credentials confirmed
            tourInfo.loadData();
        },function(error){
            Auth.confirmCredentials();
            //Nothing needs to be done here.
            tourInfo.loadData();
            ngNotify.set("Internet or Server Unavailable; Limited Functionality", {type: "error", sticky: true});
        });
        
        //appStateStore.loadData();
        
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                // StatusBar.styleDefault();
                StatusBar.styleLightContent();
            }
            
            ImgCache.$init();
        });
        
        function onDeviceReady() {
            ImgCache.$init();
        }

        document.addEventListener("deviceready", onDeviceReady, false);
        
        // If resolve fails, handles error by redirecting to error state
        $rootScope.$on('$stateChangeError', function(event, current, previous, error) {
            alert("Device not supported");
            $state.go('tour.error');
        });
    }]);

publicArtApp.constant('$ionicLoadingConfig', {
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
});