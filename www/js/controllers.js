'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('errorCtrl', ['$rootScope','$state','$ionicSideMenuDelegate',
    function($rootScope,$state,$ionicSideMenuDelegate) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
        
}]);

appControllers.controller('introCtrl', ['$rootScope','$scope','$state', '$ionicSlideBoxDelegate','$ionicSideMenuDelegate',
    function($rootScope, $scope, $state, $ionicSlideBoxDelegate,$ionicSideMenuDelegate) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(false);
        
        $rootScope.curState = $state.current.name;
        $rootScope.prevState = $rootScope.curState;
        // Called to navigate to the main app
        $scope.startApp = function() {
            $state.go('tour.collage',{tourID:1});
        };
        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
}]);

appControllers.controller('menuCtrl', ['$rootScope','$scope','$http','tourInfo','Restangular','$ionicSlideBoxDelegate','$state','appStateStore','$ionicSideMenuDelegate','$timeout','$ionicScrollDelegate','$location',
    function($rootScope, $scope, $http, tourInfo, Restangular, $ionicSlideBoxDelegate,$state,appStateStore,$ionicSideMenuDelegate,$timeout,$ionicScrollDelegate,$location) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.toursGet = tourInfo.getTours;
        
        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.selectedMarker = null;
        
        $scope.tourArt = [];
        
//        if ($rootScope.curState=='tour.intro') {
//            $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(false);
//        }
//        else{
//            
//            $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
//        }
        
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
        
        $scope.isActive = function(route) {
            return route === $location.path();
        }
}]);

appControllers.controller('collageCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout','artworkIn','toursIn', '$ionicScrollDelegate','$state','$ionicModal','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,artworkIn,toursIn,$ionicScrollDelegate,$state,$ionicModal,$ionicSideMenuDelegate) {
        
        var isFirst = localStorage.getItem("ARTourFirstLaunch");
        
        if(isFirst!="true"){
            localStorage.setItem("ARTourFirstLaunch","true");
            $state.go('tour.intro');
        }
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
        $scope.tourID = $stateParams.tourID;
        $scope.tourGet = tourInfo.getTourByID;
        $scope.curTour = $scope.tourGet($scope.tourID);
        $scope.artworkGet = tourInfo.getArtworkByTourID;
        
        $scope.genImList = function(artOb){
            
            var primeImage = artOb.image.split(",")[0].replace(/.png/g, '_thumb.png');
            
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ primeImage;
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

        }
        
        $scope.hideMap = function(){
            $ionicScrollDelegate.$getByHandle('sliderScroll').resize();
            $scope.mapShow = false;
        }
        
        $scope.$watch('query', function(){
            if($scope.query && $scope.query !== "")
                $scope.hideMap();
        });
        
        $ionicModal.fromTemplateUrl('partials/mapModal.html', { //use
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
        $ionicModal.fromTemplateUrl('partials/arModal.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal2 = modal;
        });
        $scope.openModal2 = function() {
            $scope.modal2.show();
        };
        $scope.closeModal2 = function() {
            $scope.modal2.hide();
        };
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$timeout','$state','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$state,$ionicSideMenuDelegate) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $state.go('tour.collage',{tourID:1});
    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$ionicScrollDelegate','$state','$cordovaInAppBrowser','$ionicModal','$ionicSideMenuDelegate', 'artworkIn',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$ionicScrollDelegate,$state,$cordovaInAppBrowser,$ionicModal,$ionicSideMenuDelegate,artworkIn) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
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
        
        $ionicModal.fromTemplateUrl('partials/mapModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        }); 
    }]);

appControllers.controller('favoriteCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService','$state','$ionicSideMenuDelegate','$ionicModal',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService,$state,$ionicSideMenuDelegate,$ionicModal) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
        $scope.getArtByArtID = tourInfo.getArtworkByID;
        
        $scope.genImList = function(artOb){
            var primeImage = artOb.image.split(",")[0].replace(/.png/g, '_thumb.png');
            
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ primeImage;
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
        $ionicModal.fromTemplateUrl('partials/arModal.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal2 = modal;
        });
        $scope.openModal2 = function() {
            $scope.modal2.show();
        };
        $scope.closeModal2 = function() {
            $scope.modal2.hide();
        };
    }]);

appControllers.controller('arCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService','$ionicSideMenuDelegate','$state',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService,$ionicSideMenuDelegate,$state) {
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
        
        $scope.ARModeActive = app.isLoaded;

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
        
        var onBackKeyDown = function() {
            $scope.returnToAR();
            document.removeEventListener("backbutton", onBackKeyDown, false);
        }
        
        if($scope.ARModeActive) {
            document.addEventListener("backbutton", onBackKeyDown, false);
        }
    }]);

appControllers.controller('aboutCtrl', ['$scope','$rootScope','$ionicSideMenuDelegate','$state','$cordovaInAppBrowser',
    function($scope,$rootScope,$ionicSideMenuDelegate,$state,$cordovaInAppBrowser){
        
        $ionicSideMenuDelegate.$getByHandle('main-menu').canDragContent(true);
        
        $rootScope.prevState = $rootScope.curState;
        $rootScope.curState = $state.current.name;
        
        if($ionicSideMenuDelegate.$getByHandle('main-menu').isOpenLeft()) {
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        }
}]);