'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope','$http','tourInfo','Restangular','$ionicSlideBoxDelegate','$state','appStateStore',
    function($rootScope, $scope, $http, tourInfo, Restangular, $ionicSlideBoxDelegate,$state,appStateStore) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.toursGet = tourInfo.getTours;
        
        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.toursOpen = appStateStore.getToursOpen;
        $scope.artworkOpen = appStateStore.getArtworkOpen;
        $scope.setToursOpen = appStateStore.setToursOpen;
        $scope.setArtworkOpen = appStateStore.setArtworkOpen;
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet());
        };
        
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
        
        $scope.selectedMarker = null;
        
        $scope.tourArt = [];
    }]);

appControllers.controller('imslideCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$ionicScrollDelegate) {
        $scope.tourID = $stateParams.tourID;
        $scope.tourGet = tourInfo.getTourByID;
        $scope.artworkGet = tourInfo.getArtworkByTourID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet($scope.tourID));
        };
        
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
        
        $timeout(function() {
            $ionicSlideBoxDelegate.$getByHandle("main-slider").update();
        },1500);
        
        $scope.slideHasChanged = function(index) {
            $ionicSlideBoxDelegate.$getByHandle("main-slider").update();
        }
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$timeout',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout) {

        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), tourInfo.getArtwork());
        };
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        };
        
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
        
        $scope.goBack = function(){
            
            $ionicNavBarDelegate.back();
        }
    }]);

appControllers.controller('favoriteCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService) {
        $scope.favorites = favoriteService.getFavorites();
        $scope.getArtByArtID = tourInfo.getArtworkByID;
        
        $scope.favoriteArt = [];
        angular.forEach($scope.favorites, function(val) {
            $scope.favoriteArt.push($scope.getArtByArtID(val));
        });
        
        $scope.isFavorite = favoriteService.isFavorite($scope.art_id);
        
        $scope.markFavorite = function() {
            favoriteService.setFavorite($scope.art_id, true);
            $scope.isFavorite = !$scope.isFavorite;
        }
        
        $scope.markNotFavorite = function() {
            favoriteService.setFavorite($scope.art_id, false);
            $scope.isFavorite = !$scope.isFavorite;
        }
        
        $scope.toggleFavorite = function() {
            favoriteService.setFavorite($scope.art_id, !favoriteService.isFavorite($scope.art_id));
            $scope.isFavorite = !$scope.isFavorite;
        }
    }]);

appControllers.controller('menuCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate','appStateStore',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate,$stateParams, $timeout, $ionicScrollDelegate,appStateStore) {
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