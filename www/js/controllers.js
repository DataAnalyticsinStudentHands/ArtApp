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
        $scope.current_art_id = $scope.artworkGet($scope.tourID)[0].artwork_id;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.slideHasChanged = function(index) {
            if(!index || index >= $scope.artworkGet($scope.tourID).length) {
                $scope.visible_art_title = "Tour Map";
                $scope.current_art_id = false;
            } else {
                $scope.visible_art_title = $scope.artworkGet($scope.tourID)[index].title;
                $scope.current_art_id = $scope.artworkGet($scope.tourID)[index].artwork_id;
            }
        };
        
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
            mapevents: {redirect: false, loadmap: false},
            listen: true
        };
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams) {

    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams) {
        $scope.art_id = $stateParams.artID;
        $scope.detailArt = tourInfo.getArtworkByID($scope.art_id);
        console.log($scope.detailArt);
    }]);

appControllers.controller('menuCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate,$stateParams, $timeout) {
        $rootScope.menuToggle = function(){
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        };
        $timeout($rootScope.menuToggle, 1000);
    }]);