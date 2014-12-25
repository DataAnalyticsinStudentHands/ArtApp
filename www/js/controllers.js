'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope','$http','geolocationServe','tourInfo','Restangular','$ionicSlideBoxDelegate','$state',
    function($rootScope, $scope, $http, geolocationServe, tourInfo, Restangular, $ionicSlideBoxDelegate,$state) {
//        ionic.Platform.ready(function() {
//            navigator.splashscreen.hide();
//        });
        
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
        
        $scope.testFunc = function(){
            console.log('HEYEYEYEYEYE');
            $state.go('search.artwork');
        }
    }]);

appControllers.controller('imslideCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams) {
        $scope.tourID = $stateParams.tourID;
        $scope.tourGet = tourInfo.getTourByID;
        $scope.artworkGet = tourInfo.getArtworkByTourID;
        $scope.visible_art_title = $scope.artworkGet($scope.tourID)[0].title;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.slideHasChanged = function(index){
            $scope.visible_art_title = $scope.artworkGet($scope.tourID)[index].title;
        };
        
        $scope.loadAR = function() {
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet($scope.tourID));
        };
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams) {
        
    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams) {
        $scope.art_id = $stateParams.artID;
        $scope.detailArt = tourInfo.getArtworkByID($scope.art_id);
    }]);

appControllers.controller('menuCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate,$stateParams) {
        $rootScope.menuToggle = function(){
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        };
    }]);