'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('menuCtrl', ['$rootScope','$scope','$http','tourInfo','Restangular','$ionicSlideBoxDelegate','$state','appStateStore','$ionicSideMenuDelegate','$timeout','$ionicScrollDelegate',
    function($rootScope, $scope, $http, tourInfo, Restangular, $ionicSlideBoxDelegate,$state,appStateStore,$ionicSideMenuDelegate,$timeout,$ionicScrollDelegate) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.toursGet = tourInfo.getTours;
        
        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.selectedMarker = null;
        
        $scope.tourArt = [];
        
        
        $rootScope.menuToggle = function(){
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            appStateStore.setMenuOpen(!$ionicSideMenuDelegate.isOpenLeft());
        };
        
        if(appStateStore.getMenuOpen()){
            $timeout(function(){
                $rootScope.menuToggle();
                appStateStore.setMenuOpen(true);
            }, 1000);
        }
        $scope.resizeScroll = function(){
            $ionicScrollDelegate.$getByHandle('menuScroll').resize();
        }
    }]);

appControllers.controller('collageCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$ionicScrollDelegate) {
        $scope.tourID = $stateParams.tourID;
        $scope.tourGet = tourInfo.getTourByID;
        $scope.artworkGet = tourInfo.getArtworkByTourID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        var markersArr = [];
        
        $scope.artworkGet($scope.tourID).forEach(function(obj) {
            var tempMarker = [];
            tempMarker.latLong = ""+obj.location_lat+", "+obj.location_long + "";
            tempMarker.markerData = obj;
            markersArr.push(tempMarker);
        });
        
        $scope.map = {
            sensor: true,
            size: '500x500',
            zoom: 15,
            center: '29.722000, -95.34350', //CENTER OF UH
            markers: markersArr,
            mapevents: {redirect: false, loadmap: true},
            listen: true
        };
        
        $scope.mapShow = false;
        $scope.toggleMap = function() {
            $ionicScrollDelegate.$getByHandle('sliderScroll').resize();
            $scope.mapShow = !$scope.mapShow;
            if($scope.mapShow) {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollBottom(true);
            } else {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollTop(true);
            }
        }
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$timeout','$state',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$state) {
        
        var toursLoaded = false;
        var artworkLoaded = false;
        
        if(tourInfo.toursLoaded() && tourInfo.artworkLoaded()){
            
            $state.go('tour.collage',{tourID:1});
        }
        
        $scope.$on('tours:loaded', function(event,data) {
            // you could inspect the data to see if what you care about changed, or just update your own scope
            toursLoaded = true;
            
            if(artworkLoaded){
                
                $state.go('tour.collage',{tourID:1});
            }
        });
        
        $scope.$on('artwork:loaded', function(event,data) {
            // you could inspect the data to see if what you care about changed, or just update your own scope
            artworkLoaded = true;
            
            if(toursLoaded){
                
                $state.go('tour.collage',{tourID:1});
            }
        });
    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$ionicScrollDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$ionicScrollDelegate) {
        $scope.art_id = $stateParams.artID;
        $scope.detailArt = tourInfo.getArtworkByID($scope.art_id);
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        };
        
        $scope.resizeScroll = function(){
            $ionicScrollDelegate.$getByHandle('detailScroll').resize();
        }
        
        var markersArr = [];
        var tempMarker = [];
        tempMarker.latLong = $scope.detailArt.location_lat+", "+$scope.detailArt.location_long;
        tempMarker.markerData = $scope.detailArt;
        markersArr.push(tempMarker);
        
        $scope.map = {
            sensor: true,
            size: '500x500',
            zoom: 15,
            center: '29.722000, -95.34350', //CENTER OF UH
            markers: markersArr,
            mapevents: {redirect: false, loadmap: true},
            listen: true
        };
        
        $scope.mapShow = false;
        $scope.toggleMap = function() {
            $ionicScrollDelegate.$getByHandle('detailScroll').resize();
            $scope.mapShow = !$scope.mapShow;
            if($scope.mapShow) {
                $ionicScrollDelegate.$getByHandle('detailScroll').scrollBottom(true);
            }
        };
        
        $scope.goBack = function(){
            $ionicNavBarDelegate.back();
        };
    }]);

appControllers.controller('favoriteCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService) {
        $scope.getArtByArtID = tourInfo.getArtworkByID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.updateFavorites = function() {
            $scope.favorites = favoriteService.getFavorites();
            $scope.favoriteArt = [];
            angular.forEach($scope.favorites, function(val) {
                $scope.favoriteArt.push($scope.getArtByArtID(val));
            });
        }
        $scope.updateFavorites();
        
        $scope.isFavorite = favoriteService.isFavorite($scope.art_id);
        
        $scope.toggleFavorite = function() {
            favoriteService.setFavorite($scope.art_id, !favoriteService.isFavorite($scope.art_id));
            $scope.isFavorite = !$scope.isFavorite;
        }

        $scope.deleteFavorite = function(art_id) {
            favoriteService.setFavorite(art_id, false);
            $scope.updateFavorites();
        }
    }]);

appControllers.controller('arCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService,$ionicSideMenuDelegate) {
        $scope.ARModeActive = app.isLoaded;
        
        var onBackKeyDown = function() {
            $scope.returnToAR();
            document.removeEventListener("backbutton", onBackKeyDown, false);
        }

        $scope.loadAR = function(JSON, TourName, TourID) {
            $stateParams.AR = false;
            if($scope.ARModeActive){
                app.loadARchitectWorld(null, JSON, TourName, TourID);
            } else {
                app.loadARchitectWorld(getSamplePath(0, 0), JSON, TourName, TourID);
            }
            if($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            }
        };
        
        $scope.returnToAR = function() {
            app.loadARchitectWorld();
        }
        
        if($scope.ARModeActive) {
            document.addEventListener("backbutton", onBackKeyDown, false);
        }
    }]);

appControllers.controller('aboutCtrl', ['$scope','$rootScope','$ionicSideMenuDelegate',
    function($scope,$rootScope,$ionicSideMenuDelegate){
        
        if($ionicSideMenuDelegate.$getByHandle('main-menu').isOpenLeft()) {
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        }
}]);