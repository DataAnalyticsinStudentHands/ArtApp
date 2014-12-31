'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope','$http','tourInfo','Restangular','$ionicSlideBoxDelegate','$state',
    function($rootScope, $scope, $http, tourInfo, Restangular, $ionicSlideBoxDelegate,$state) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.toursGet = tourInfo.getTours;
        
        $scope.artworkGet = tourInfo.getArtwork;
        
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
        $scope.artworkGetCol = tourInfo.getArtworkColByTourID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet($scope.tourID));
        };
        
        var markersArr = [];
        $scope.artworkGet($scope.tourID).forEach(function(obj) {
            markersArr.push(""+obj.location_lat+", "+obj.location_long + "");
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
        $scope.toggleMap = function(){
            $ionicScrollDelegate.$getByHandle('sliderScroll').resize();
            $scope.mapShow = !$scope.mapShow;
            if($scope.mapShow) {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollBottom(true);
            } else {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollTop(true);
            }
        }
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$timeout',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout) {

        $scope.artworkGet = tourInfo.getStartupCol;
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet());
        };
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        };
        
    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$ionicScrollDelegate','$ionicNavBarDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$ionicScrollDelegate,$ionicNavBarDelegate) {
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

appControllers.controller('menuCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate,$stateParams, $timeout, $ionicScrollDelegate) {
        $rootScope.menuToggle = function(){
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        };
        $timeout($rootScope.menuToggle, 1000);
        $scope.resizeScroll = function(){
            $ionicScrollDelegate.$getByHandle('menuScroll').resize();
        }
    }]);