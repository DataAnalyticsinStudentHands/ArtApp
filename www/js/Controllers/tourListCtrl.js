/*global angular, console, ionic, google, alert */
/*jslint plusplus: true */

/* Controllers */
angular.module('Controllers').controller('tourListCtrl', function ($rootScope, $scope, $state, $http, snapRemote, geolocationServe) {
    'use strict';
    
    ionic.Platform.ready(function () {
        navigator.splashscreen.hide();
    });
    
    $scope.showAdd = false;

    //Uses local storage instead of http requests
    $scope.tours = JSON.parse(localStorage.getItem("tours"));
    $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
    $scope.favorites = JSON.parse(localStorage.getItem("favorites"));

    $scope.selectedMarker = null;

    $scope.tourArt = [];


    $scope.sliderOptions = {
        disable: 'right',
        hyperextensible: false
    };
    snapRemote.getSnapper().then(function (snapper) {
        snapper.open('left');
    });

    var mapDiv = document.getElementById('map-canvas'),
        mapOptions = {
            center: new google.maps.LatLng(29.719950, -95.342234),
            draggable: false,
            disableDefaultUI: true,
            zoom: 16
        },
        map = new google.maps.Map(mapDiv, mapOptions),
        markers = [],
        bounds = new google.maps.LatLngBounds();

    //Creates marker object, adds it to map, adds it to markers array
    function addMarker(location, art) {
        $scope.tourArt.push(art);
        var image = {
            url: "img/mapmarker.svg",
            scaledSize: new google.maps.Size(40, 60)
            /*size: new google.maps.Size(40, 60),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(20, 60)*/
        },
            marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: image
            });
        markers.push(marker);
        bounds.extend(location);
        map.fitBounds(bounds);

        google.maps.event.addListener(marker, 'click', function () {
            $scope.openProfile(art);
        });
    }

    // Sets the map on all markers in the array.
    function setAllMap(map) {
        var i;
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setAllMap(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setAllMap(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
        bounds = new google.maps.LatLngBounds();
    }

    //closes profile page and resets fav/add button
    $scope.closeProfile = function () {
        console.log('close profile');
        $scope.selectedMarker = null;
        $rootScope.favActive = false;
    };

    //opens profile and set fav/add as active or not
    $scope.openProfile = function (art) {
        console.log('open profile');
        $scope.$apply(function () {
            $scope.selectedMarker = art;
            console.log("is fav: " + $rootScope.isFavorite(art.artwork_id));
            $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
        });
    };

    //When tour name is clicked the corresponding markers are added.
    $scope.tourClick = function (tour) {
        deleteMarkers();
        $scope.tourArt = [];
        var x, y;
        for (x = 0; x < tour.artwork_included.length; x++) {

            for (y = 0; y < $scope.artwork.length; y++) {

                if (tour.artwork_included[x] === $scope.artwork[y].artwork_id) {
                    addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                }

            }

        }
    };

    //adds markers for favorites tour
    $scope.favTourClick = function () {
        deleteMarkers();
        $scope.tourArt = [];
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
        if ($scope.favorites !== null) {
            var x, y;
            for (x = 0; x < $scope.favorites.length; x++) {
                for (y = 0; y < $scope.artwork.length; y++) {
                    if ($scope.favorites[x] === $scope.artwork[y].artwork_id) {
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                }
            }
        } else {
            alert("You don't have any favorites yet!");
        }
    };

    //adds markers for artwork add within the last X months
    $scope.newTourClick = function () {
        deleteMarkers();
        $scope.tourArt = [];
        var y;
        for (y = 0; y < $scope.artwork.length; y++) {
            if ($scope.artwork[y].date_made > 2000) {
                addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
            }
        }
    };

    //start tour
    $scope.startTour = function () {
        $rootScope.showTour = true;
        $rootScope.tourPieces = $scope.tourArt;
        $state.go('explore');
    };

});