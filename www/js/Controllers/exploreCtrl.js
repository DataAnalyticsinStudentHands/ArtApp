/*global angular, console, ionic, google, alert, intel*/
/*jslint plusplus: true */

/* Controllers */
angular.module('Controllers').controller('exploreCtrl', function ($rootScope, $scope, $state, $http, accelerometerServe, compassServe, geolocationServe) {
    'use strict';
    $scope.showAdd = true;
    $rootScope.focus = $rootScope.someFocus();

    $scope.selectedMarker = null;
    $scope.currAcc = null;
    var accWatchID = null,
        compWatchID = null,
        geoWatchID = null,
        geoWatchIntelID = null,
        mapDiv = document.getElementById('map-view'),
        mapOptions = {
            center: new google.maps.LatLng(29.719950, -95.342234),
            draggable: true,
            disableDefaultUI: false,
            streetViewControl: false,
            overviewMapControl: true,
            overviewMapControlOptions: {
                opened: false
            },
            zoom: 14
        },
        map = null,
        markers = [],
        yourMarker = {
            url: "img/yourMarker.svg",
            size: new google.maps.Size(27, 41),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 31)
        },
        currMarker = new google.maps.Marker({
            icon: yourMarker
        }),
        bounds = new google.maps.LatLngBounds();
    $scope.campusCircle = new google.maps.Circle({
        center: new google.maps.LatLng(29.721677, -95.341912),
        radius: 1000
    });
    $scope.currHeading = null;
    $scope.currPosition = null;
    $scope.phoneUp = false;
    $scope.toggle = false;
    $scope.onCampus = true;
    $scope.maxD = 0;
    $scope.minD = 100;
    $scope.camInUse = false;

    //Uses local storage instead of http requests
    if ($rootScope.showTour) {
        $scope.artwork = $rootScope.tourPieces;
    } else {
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
    }

    $scope.back = function () {
        if ($rootScope.showTour) {
            $state.go('tours');
        } else {
            $state.go('index');
        }
    };

    //Creates marker object, adds it to map, adds it to markers array
    function addMarker(location, art) {
        var image = {
                url: "img/mapmarker.svg",
                size: new google.maps.Size(27, 41),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 31)
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

    //Initializes map markers
    function initMap() {
        map = new google.maps.Map(mapDiv, mapOptions);
        var y;
        for (y = 0; y < $scope.artwork.length; y++) {
            addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
        }
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

    //open camera
    $scope.openCamera = function () {
        xdkStopAR();
        $scope.camInUse = true;
        intel.xdk.camera.takePicture(70, true, 'jpg');

        function cameraDone() {
            console.log("Hello");
            $scope.camInUse = false;
        }
        document.addEventListener("intel.xdk.camera.picture.add", cameraDone);
        document.addEventListener("intel.xdk.camera.picture.cancel", cameraDone);

    };

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
        $scope.$apply(function () {
            $scope.selectedMarker = art;
            console.log("is fav: " + $rootScope.isFavorite(art.artwork_id));
            $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
            console.log("is focused: " + $rootScope.isFocused(art.artwork_id));
            $rootScope.addActive = $rootScope.isFocused(art.artwork_id);
        });
    };

    //Toggle AR/Map view
    $scope.toggleView = function () {
        if ($scope.toggle) {
            $scope.toggle = false;
        } else {
            $scope.toggle = true;
        }
    };

    // start intel.xdk augmented reality mode, adds camera in background       
    function xdkStartAR() {
        //intel.xdk.display.startAR();
        if (document.body.style.backgroundColor !== "transparent" && !$scope.camInUse) {
            console.log("...Start AR called...");
            document.body.style.backgroundColor = "transparent";
            document.body.style.backgroundImage = 'none';
        }
    }

    // stop intel.xdk augmented reality mode        
    function xdkStopAR() {
        //intel.xdk.display.stopAR();
        if (document.body.style.backgroundColor === "transparent" && !$scope.camInUse) {
            console.log("...Stop AR called...");
            document.body.style.backgroundColor = "#000";
            document.body.style.backgroundImage = "url('img/jimsanborn.jpg')";
        }
    }

    //Add elements for AR view given the heading
    function addArElements(heading) {
        var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
            direction = directions[Math.abs(parseInt((heading.magneticHeading) / 45) + 0)],
            html = "",
            z,
            margin,
            Ind,
            zInd,
            top,
            scaleFactor,
            scale;
        for (z = 0; z < $scope.artwork.length; z++) {
            margin = (((($scope.artwork[z].bearing - heading.magneticHeading) + 20) / 40) * 100) - 9;
            Ind = (($scope.artwork[z].distance - $scope.minD) / ($scope.maxD - $scope.minD)) * 10;
            zInd = Math.round(10 - Ind);
            top = ((Ind / 10) * 30) + 35;
            scaleFactor = ((top - 35) / 30) * 20;
            scale = 25 - scaleFactor;

            if ($scope.artwork[z].distance === $scope.minD && $scope.artwork[z].distance <= 0.01858638447759765) {
                //console.log("Closest: "+$scope.artwork[z]['title'] );
                html += '<h1 align="center" style="position:absolute;top:70%;left:0px;">Look around, your near Art!</h1><img ng-click="selectMarker(' + z + ',' + zInd +
                    ')" src="img/mapmarker.svg" style="position:absolute;left:' + 25 +
                    '%;top:' + 90 +
                    '%;width:50%;height:auto;z-index:' + zInd +
                    ';">';
            } else {
                if (Math.abs($scope.artwork[z].bearing - heading.magneticHeading) <= 20) {
                    if ($rootScope.focusedArt.length === 0) {
                        html += '<img ng-click="selectMarker(' + z + ',' + zInd +
                            ')" src="img/mapmarker.svg" style="position:absolute;left:' + margin +
                            '%;bottom:' + top +
                            '%;width:auto;height:' + scale +
                            '%;z-index:' + zInd +
                            ';">';
                    } else if ($rootScope.focusedArt.indexOf($scope.artwork[z].artwork_id) > -1) {
                        html += '<img ng-click="selectMarker(' + z + ',' + zInd +
                            ')" src="img/mapmarker.svg" style="position:absolute;left:' + margin +
                            '%;bottom:' + top +
                            '%;width:auto;height:' + scale +
                            '%;z-index:' + zInd +
                            ';">';
                    }

                }
            }
        }
        $scope.arHTML = html;
    }

    $scope.selectMarker = function (art, x) {
        $scope.selectedMarker = $scope.artwork[art];
        console.log("z index: " + x);
    };

    function calculateBearing() {
        console.log('...Calculate Bearing...');
        var z, pinLat, pinLng, dLat, dLon, lat1, lat2, y, x, bearing, a, c, distance;
        for (z = 0; z < $scope.artwork.length; z++) {
            pinLat = $scope.artwork[z].location_lat;
            pinLng = $scope.artwork[z].location_long;
            dLat = ($scope.currPosition.coords.latitude - pinLat) * Math.PI / 180;
            dLon = ($scope.currPosition.coords.longitude - pinLng) * Math.PI / 180;
            lat1 = pinLat * Math.PI / 180;
            lat2 = $scope.currPosition.coords.latitude * Math.PI / 180;
            y = Math.sin(dLon) * Math.cos(lat2);
            x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            bearing = Math.atan2(y, x) * 180 / Math.PI;
            bearing = bearing + 180;
            $scope.artwork[z].bearing = bearing;

            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance = 3958.76 * c;
            if (distance > $scope.maxD) {
                $scope.maxD = distance;
            }
            if (distance < $scope.minD) {
                $scope.minD = distance;
            }
            $scope.artwork[z].distance = distance;
        }

    }

    //Accelerometer                                    
    $scope.getAcceleration = function () {
        accelerometerServe.getCurrentAcceleration().then(function (result) {
            $scope.currAcc = result;
        }, function (err) {
            //Error
        });
    };

    $scope.watchAcceleration = function () {
        var aOptions = {
            frequency: 1000
        };
        if (accWatchID === null) {
            accWatchID = accelerometerServe.watchAcceleration(aOptions).then(
                function (res) {},
                function (err) {
                    alert(err);
                },
                function (result) {
                    $scope.currAcc = result.acc;
                    accWatchID = result.id;
                    if (result.acc.y > 7.5 && !$scope.toggle) {
                        $scope.phoneUp = true;
                        xdkStartAR();
                    } else if (result.acc.y < 6 && !$scope.toggle) {
                        $scope.phoneUp = false;
                        xdkStopAR();
                    } else if ($scope.toggle) {
                        $scope.phoneUp = false;
                        xdkStopAR();
                    }
                }
            );
        }
    };

    $scope.clearAccWatch = function () {
        accelerometerServe.clearWatch(accWatchID);
        accWatchID = null;
    };

    //Compass                                    
    $scope.getHeading = function () {
        compassServe.getCurrentHeading().then(function (result) {
            $scope.currHeading = result;
        }, function (err) {
            //Error
        });
    };

    $scope.watchHeading = function () {
        var options = {
            frequency: 500
        }; // Update every 1 seconds
        if (compWatchID === null) {
            compWatchID = compassServe.watchHeading(options).then(
                function (res) {},
                function (err) {},
                function (result) {
                    $scope.currHeading = result.head;
                    compWatchID = result.id;
                    if ($scope.phoneUp) {
                        addArElements(result.head);
                    }
                }
            );
        }
    };

    $scope.clearCompWatch = function () {
        compassServe.clearWatch(compWatchID);
        compWatchID = null;
    };

    //Geolocation CORDOVA
    $scope.getPosition = function () {
        geolocationServe.getCurrentPosition().then(function (position) {
            $scope.currPosition = position;
            console.log(position);
        }, function (err) {
            //Error
        });
    };

    $scope.watchPosition = function () {
        var gOptions = {
            maximumAge: 3000,
            timeout: 6000,
            enableHighAccuracy: true
        };
        if (geoWatchID === null) {
            geoWatchID = geolocationServe.watchPosition(gOptions).then(
                function (res) {},
                function (err) {},
                function (result) {
                    $scope.currPosition = result.loc;
                    geoWatchID = result.id;
                    var pos = new google.maps.LatLng(result.loc.coords.latitude, result.loc.coords.longitude);
                    if (!$scope.campusCircle.contains(pos)) {
                        $scope.onCampus = false;
                    }
                    currMarker.setPosition(pos);
                    if (!bounds.contains(pos)) {
                        bounds.extend(pos);
                        map.fitBounds(bounds);
                    }
                    currMarker.setMap(map);
                    calculateBearing();
                }
            );
        }

    };

    $scope.clearGeoWatch = function () {
        geolocationServe.clearWatch(geoWatchID);
    };

    //Geolocation INTEL
    $scope.getPositionIntel = function () {
        intel.xdk.geolocation.getCurrentPosition(function (position) {
            alert('success');
            addMarker(position, "Intel getPosition");
        }, function (err) {
            //Error
            alert('error');
        });
    };

    $scope.watchPositionIntel = function () {
        if (geoWatchIntelID === null) {
            geoWatchIntelID = intel.xdk.geolocation.watchPosition(function (position) {
                $scope.currPosition = position;
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                currMarker.setPosition(pos);
                if (!($scope.campusCircle.getBounds().contains(pos))) {
                    $scope.onCampus = false;
                } else {
                    $scope.onCampus = true;
                }
                currMarker.setPosition(pos);
                if (!bounds.contains(pos)) {
                    bounds.extend(pos);
                    map.fitBounds(bounds);
                }
                currMarker.setMap(map);
                calculateBearing();
            }, function (err) {
                //Error
                alert('error');
            }, {
                enableHighAccuracy: true
            });
        }
    };

    $scope.clearGeoWatchIntel = function () {
        intel.xdk.geolocation.clearWatch(geoWatchIntelID);
    };

    //Start all watches
    function startWatches() {
        $scope.watchAcceleration();
        $scope.watchHeading();
        //$scope.watchPosition();
        $scope.watchPositionIntel();
    }

    //Stop all watches
    function stopWatches() {
        $scope.clearAccWatch();
        $scope.clearCompWatch();
        //$scope.clearGeoWatch();
        $scope.clearGeoWatchIntel();
    }

    function lock() {
        console.log('PHONE LOCKED');
        xdkStopAR();
        stopWatches();
    }
    
    function background() {
        console.log('SENT TO BACKGROUND');
        xdkStopAR();
        stopWatches();
    }
    
    function open() {
        console.log('OPEN/RESUME');
        startWatches();
    }
    
    function initListeners() {
        //pause fires when device locks 
        //when a device is locked the app is sent to background first
        //so locking the screen while in the app fires both pause and suspend event
        document.addEventListener("intel.xdk.device.pause", lock, false);
        //suspend only fires if the app goes into the background
        document.addEventListener("intel.xdk.device.suspend", background, false);
        document.addEventListener("intel.xdk.device.resume", open, false);
    }

    function destroyListeners() {
        document.removeEventListener("intel.xdk.device.pause", lock, false);
        document.removeEventListener("intel.xdk.device.suspend", background, false);
        document.removeEventListener("intel.xdk.device.resume", open, false);
    }
    
    $scope.$on("$destroy", function () {
        destroyListeners();
        xdkStopAR();
        stopWatches();
        $rootScope.showTour = false;
        $rootScope.tourPieces = [];
    });

    //Start everything
    initMap();
    open();
    initListeners();

});