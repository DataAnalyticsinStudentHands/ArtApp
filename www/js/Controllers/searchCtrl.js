/*global angular, console, ionic, google, alert, intel */
/*jslint plusplus: true */

/* Controllers */
angular.module('Controllers').controller('searchCtrl', function ($scope, $rootScope) {
    'use strict';
    $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
    $scope.artists = [];
    var x,
        temp;
    for (x = 0; x < $scope.artwork.length; x++) {
        temp = $scope.artwork[x].artist_name;
        if ($scope.artists.indexOf(temp) === -1) {
            $scope.artists.push(temp);
        }
    }

    $scope.showAdd = true;
    $scope.selectedMarker = null;
    $scope.order = 'date_made';
    $scope.reverse = false;

    //closes profile page
    $scope.closeProfile = function () {
        console.log('close profile');
        $scope.selectedMarker = null;
        $rootScope.favActive = false;
        $rootScope.addActive = false;
        $rootScope.focus = $rootScope.someFocus();
    };

    //opens profile
    $scope.openProfile = function (art) {
        console.log('open profile');
        //$scope.$apply(function () {
        $scope.selectedMarker = art;
        console.log("is fav: " + $rootScope.isFavorite(art.artwork_id));
        $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
        console.log("is focused: " + $rootScope.isFocused(art.artwork_id));
        $rootScope.addActive = $rootScope.isFocused(art.artwork_id);
        //});
    };
    
    function calculateDistance(pos) {
        var z, pinLat, pinLng, dLat, dLon, lat1, lat2, a, c, distance;
        for (z = 0; z < $scope.artwork.length; z++) {
            pinLat = $scope.artwork[z].location_lat;
            pinLng = $scope.artwork[z].location_long;
            dLat = (pos.coords.latitude - pinLat) * Math.PI / 180;
            dLon = (pos.coords.longitude - pinLng) * Math.PI / 180;
            lat1 = pinLat * Math.PI / 180;
            lat2 = pos.coords.latitude * Math.PI / 180;

            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance = 3958.76 * c;
            $scope.artwork[z].distance = distance;
        }
    }

    $scope.getPositionIntel = function () {
        intel.xdk.geolocation.getCurrentPosition(function (position) {
            console.log("Got Position");
            calculateDistance(position);
        }, function (err) {
            //Error
            alert('error');
        });
    };

    
    $scope.setSearch = function (text) {
        $scope.search = text;
    };

    $scope.searchFunction = function () {
        return function (dude) {

        };
    };

    $scope.getPositionIntel();



});