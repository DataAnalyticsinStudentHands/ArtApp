'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope', '$state', '$http', 'snapRemote',
    function($rootScope, $scope, $state, $http, snapRemote) {
        /*If true the profile page will have a focus button*/
        $scope.showAdd = false;
        
        /*Set scope variables to data stored on localstorage*/
        $scope.tours = JSON.parse(localStorage.getItem("tours"));
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
        
        /*Variable that will store the artwork which is selected. It will be used to show information on the profile page*/
        $scope.selectedMarker = null;
        
        /*Array will store the artwork data for the selected tour*/
        $scope.tourArt = [];
        
        /*Set snap slider options and opens the slider menu when page loads*/
        $scope.sliderOptions = {disable: 'right', hyperextensible: false};
        snapRemote.getSnapper().then(function(snapper) {
            snapper.open('left');
        });
        
        /*Sets up google map stuff*/
        var mapDiv = document.getElementById('map-canvas');
        var mapOptions = {
            center: new google.maps.LatLng(29.719950, -95.342234),
            draggable: false,
            disableDefaultUI: true,
            zoom: 16
        };
        var map = new google.maps.Map(mapDiv, mapOptions);
        var markers = [];
        var bounds = new google.maps.LatLngBounds();
        
        /*Adds artwork data to tourArt, creates marker object, adds it to map with corrected bounds, adds it to markers array, add listener for marker*/
        function addMarker(location, art) {
            $scope.tourArt.push(art);
            var image = {
                            url: "img/mapmarker.svg",
                            scaledSize: new google.maps.Size(40,60)
                            /*size: new google.maps.Size(40, 60),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(20, 60)*/
                          };
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: image
            });
            markers.push(marker);
            bounds.extend(location);
            map.fitBounds(bounds);
            
            google.maps.event.addListener(marker, 'click', function() {
                $scope.openProfile(art);
            });
        }

        /*Deletes all markers by clearing the markers array, reset the bounds to default zoom*/
        function deleteMarkers() {
            //For loop is somewhat redundant but I think it makes the transition of adding new markers look smoother. Need to test on device.
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
            bounds = new google.maps.LatLngBounds();
        }
        
        //closes profile page and resets fav/add button
        $scope.closeProfile = function(){
            console.log('close profile');
            $scope.selectedMarker=null;
            $rootScope.favActive = false;
        };
        
        //opens profile and set fav/add as active or not
        $scope.openProfile = function(art){
            console.log('open profile');
            $scope.$apply(function () {
                $scope.selectedMarker = art;
                console.log("is fav: "+$rootScope.isFavorite(art.artwork_id));
                $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
            });
        };
        
        /*When a tour is clicked this function adds the corresponding markers after deleting the current markers*/
        $scope.tourClick = function(tour) {
            deleteMarkers();
            $scope.tourArt = [];
            for(var x=0; x<tour.artwork_included.length; x++){
                for (var y=0; y<$scope.artwork.length; y++){
                    if (tour.artwork_included[x] == $scope.artwork[y].artwork_id){
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                }
            }
        };
        
        /*When the favorites tour is clicked this function adds the markers for the favorite artwork stored in local storage*/
        $scope.favTourClick = function() {
            deleteMarkers();
            $scope.tourArt = [];
            $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
            if ($scope.favorites!=null) {
                for(var x=0; x<$scope.favorites.length; x++){
                    for (var y=0; y<$scope.artwork.length; y++){
                        if ($scope.favorites[x] == $scope.artwork[y].artwork_id){
                            addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                        }
                    }
                }
            }else{alert("No favorites found")}
        };
        
        /*When new acquisition is clicked this function adds markers for artwork with a date_made value within the last X months*/
        $scope.newTourClick = function() {
            deleteMarkers();
            $scope.tourArt = [];
            for (var y=0; y<$scope.artwork.length; y++){
                    if ($scope.artwork[y].date_made > 2008){
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                }
        };
        
        /*When start tour is clicked this function sends app into the explore state*/
        $scope.startTour = function() {
            $rootScope.showTour = true;
            $rootScope.tourPieces = $scope.tourArt;
            $state.go('explore');
        };
        
    }]);

appControllers.controller('exploreCtrl', ['$rootScope','$scope', '$state','$http','accelerometerServe','compassServe',
  function($rootScope, $scope, $state, $http, accelerometerServe, compassServe) {
      /*If true the profile page will have a focus button*/
      $scope.showAdd = true;
      
      /*Checks whether any pieces have been focused*/
      $rootScope.focus = $rootScope.someFocus();
      
      /*Variable that will store the artwork which is selected. It will be used to show information on the profile page*/
      $scope.selectedMarker = null;
      
      /*Variables that will store acclerometer/compass/geolocation values and ids*/
      $scope.currAcc = null;
      var accWatchID = null;
      $scope.currHeading = null;
      var compWatchID = null;
      $scope.currPosition = null;      
      var geoWatchID = null;
      var geoWatchIntelID = null;
      
      /*Store useful states of the device such as phone orientation, proximity to campus*/
      $scope.phoneUp = false;
      $scope.toggle = false;
      $scope.onCampus = true;
      
      /*Store the max and min distance of a artwork at a point in time*/
      $scope.maxD = 0;
      $scope.minD = 100;
      
      /*If showTour is true meaning that the user choose a tour and now is starting the tour in explore mode then the scope variable for artwork will be set to tourPieces. Otherwise the scope variable will be set to all the artwork*/
      if ($rootScope.showTour){
          $scope.artwork = $rootScope.tourPieces;
      }else{
          $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
      };
      
      /*The back button will take the user back to where the user navigated to explore mode from. So either the origin page or tour page*/
      $scope.back = function() {
          if ($rootScope.showTour){
              $state.go('tours');
          }else{
              $state.go('index');
          }
      };
      
      /*Sets up google map stuff*/
      var mapDiv = document.getElementById('map-view');
      var mapOptions = {
          center: new google.maps.LatLng(29.719950, -95.342234),
          draggable: true,
          disableDefaultUI: false,
          streetViewControl: false,
          overviewMapControl:true,
          overviewMapControlOptions: {opened: false},
          zoom: 14
      };
      var map = null;
      var markers = [];
      var yourMarker = {
                            url: "img/yourMarker.svg",
                            size: new google.maps.Size(27, 41),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(10, 31)
                          };
      var currMarker = new google.maps.Marker({
                            icon:yourMarker
                        });
      var bounds = new google.maps.LatLngBounds();
      /*Circle bound around campus defining whether a user is on or too far from campus*/
      $scope.campusCircle = new google.maps.Circle({
              center: new google.maps.LatLng(29.721677, -95.341912),
              radius:1000
      });
      
      /*Initializes map markers for artwork stored in the scope.artwork*/
      function initMap() {
          map = new google.maps.Map(mapDiv, mapOptions);
          for (var y=0; y<$scope.artwork.length; y++){
              addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);  
          }
      }
      
      /*Creates marker object, adds it to map, adds it to markers array*/
      function addMarker(location, art) {
          var image = {
                            url: "img/mapmarker.svg",
                            size: new google.maps.Size(27, 41),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(10, 31)
                          };
          var marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: image
          });
          markers.push(marker);
          bounds.extend(location);
          map.fitBounds(bounds);
          
          google.maps.event.addListener(marker, 'click', function() {
                $scope.openProfile(art);
          });
      }
      
      /*Deletes all markers by clearing the markers array, reset the bounds to default zoom*/
      function deleteMarkers() {
          /*For loop is somewhat redundant but I think it makes the transition of adding new markers look smoother. Need to test on device.*/
          for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
          }
          markers = [];
          bounds = new google.maps.LatLngBounds();
      }
      
      //closes profile page
      $scope.closeProfile = function(){
            console.log('close profile');
            $scope.selectedMarker=null;
            $rootScope.favActive = false;
            $rootScope.addActive = false;
            $rootScope.focus = $rootScope.someFocus();
        };
      
      //opens profile
      $scope.openProfile = function(art){
          console.log('open profile');
            $scope.$apply(function () {
                $scope.selectedMarker = art;
                console.log("is fav: "+$rootScope.isFavorite(art.artwork_id));
                $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
                console.log("is focused: "+$rootScope.isFocused(art.artwork_id));
                $rootScope.addActive = $rootScope.isFocused(art.artwork_id);
            });
        };
      
      /*Toggle AR/Map view. Fuction assigned to toggle(map) button.*/
      $scope.toggleView = function(){
          if ($scope.toggle){
              $scope.toggle = false;
          }else{
              $scope.toggle = true;
          }
      }
      
      /*Start intel.xdk augmented reality mode, adds camera in background */      
      function xdkStartAR() {
          //intel.xdk.display.startAR();
          if (document.body.style.backgroundColor!="transparent"){
              console.log("...Start AR called...");
              document.body.style.backgroundColor="transparent";
              document.body.style.backgroundImage='none';
          }
      }
        
      /*Stop intel.xdk augmented reality mode*/        
      function xdkStopAR() {
          //intel.xdk.display.stopAR();
          if (document.body.style.backgroundColor=="transparent"){
              console.log("...Stop AR called...");
              document.body.style.backgroundColor="#000";
              document.body.style.backgroundImage="url('img/jimsanborn.jpg')";
          }
      } 
      
      /*Add elements for AR view given the heading*/
      function addArElements(heading) {
          var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
          var direction = directions[Math.abs(parseInt((heading.magneticHeading) / 45) + 0)];
          var html="";
          
          for (var z=0; z<$scope.artwork.length; z++) {
              var margin = (((($scope.artwork[z]['bearing'] - heading.magneticHeading)+20)/40)*100)-9;
              var Ind = (($scope.artwork[z]['distance']-$scope.minD)/($scope.maxD-$scope.minD))*10;
              var zInd = Math.round(10-Ind);
              var top = ((Ind/10)*30)+35;
              var scaleFactor = ((top-35)/30)*20;
              var scale = 25-scaleFactor;
              
              if ($scope.artwork[z]['distance']==$scope.minD && $scope.artwork[z]['distance']<=0.01858638447759765){
                  html += '<h1 align="center" style="position:absolute;top:70%;left:0px;">Look around, your near Art!</h1><img ng-click="selectMarker('+z+')" src="img/mapmarker.svg" style="position:absolute;left:'+25+
                              '%;top:'+90+
                              '%;width:50%;height:auto;z-index:'+zInd+
                              ';">';
              }else{
                  if(Math.abs($scope.artwork[z]['bearing'] - heading.magneticHeading) <= 20){
                      if ($rootScope.focusedArt.length ===0){
                          html += '<img ng-click="selectMarker('+z+')" src="img/mapmarker.svg" style="position:absolute;left:'+margin+
                                  '%;bottom:'+top+
                                  '%;width:auto;height:'+scale+
                                  '%;z-index:'+zInd+
                                  ';">';
                      }else if ($rootScope.focusedArt.indexOf($scope.artwork[z]['artwork_id'])>-1){
                          html += '<img ng-click="selectMarker('+z+')" src="img/mapmarker.svg" style="position:absolute;left:'+margin+
                                  '%;bottom:'+top+
                                  '%;width:auto;height:'+scale+
                                  '%;z-index:'+zInd+
                                  ';">';
                      }
                  }
              }
          }
          $scope.arHTML = html;
      }
      
      /*This is called when the AR mode markers are clicked*/
      $scope.selectMarker = function(artId){
          $scope.selectedMarker=$scope.artwork[artId];
      };

      /*Calculates bearing to each artwork using the users current location*/
      function calculateBearing(){
          console.log('...Calculate Bearing...');
          for (var z=0; z<$scope.artwork.length; z++){
              var pinLat = $scope.artwork[z].location_lat;
              var pinLng = $scope.artwork[z].location_long;
              var dLat = ($scope.currPosition.coords.latitude-pinLat)* Math.PI / 180;
              var dLon = ($scope.currPosition.coords.longitude-pinLng)* Math.PI / 180;
              var lat1 = pinLat * Math.PI / 180;
              var lat2 = $scope.currPosition.coords.latitude * Math.PI / 180;
              var y = Math.sin(dLon) * Math.cos(lat2);
              var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
              var bearing = Math.atan2(y, x) * 180 / Math.PI;
              bearing = bearing + 180;
              $scope.artwork[z]['bearing']=bearing;
              
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var distance = 3958.76  * c;
              if (distance>$scope.maxD){
                  $scope.maxD = distance;
              }
              if (distance<$scope.minD){
                  $scope.minD = distance;
              }
              $scope.artwork[z]['distance']=distance;
          }

      }
      
      /*Accelerometer*/
      /*Watches acceleration at regular intervals. accWatchID is used to reference this watch and is used to turn off the watch*/
      /*Sets phoneUp depending on accelorometer values. Turns AR on/off. Saves values to scope.currAcc*/
      $scope.watchAcceleration = function() {
          var aOptions = {frequency: 1000};
          if (accWatchID == null) {
              accWatchID = accelerometerServe.watchAcceleration(aOptions).then(
                  function (res) {},
                  function(err) {alert(err);},
                  function(result) {
                      $scope.currAcc = result.acc;
                      accWatchID = result.id;
                      if (result.acc.y > 7.5 && !$scope.toggle){
                          $scope.phoneUp = true;
                          xdkStartAR();
                      }else if (result.acc.y < 6 && !$scope.toggle){
                          $scope.phoneUp = false;
                          xdkStopAR();
                      }else if ($scope.toggle){
                          $scope.phoneUp = false;
                          xdkStopAR();
                      }
                  }
              );
            }
      };
      
      /*Stops accelerometer watch from continuing to read accelorometer values*/
      $scope.clearAccWatch = function() {
          accelerometerServe.clearWatch(accWatchID);
          accWatchID = null;
      };
      
      /*Compass*/
      /*Watches heading at regular intervals. compWatchID is used to reference this watch and is used to turn off the watch*/
      /*Calls addArElements which adds the markers in the AR mode depending on the current heading. Heading stored in scope.currHeading*/
      $scope.watchHeading = function() {
          var options = { frequency: 500 }; // Update every 1 seconds
          if (compWatchID == null) {
                compWatchID = compassServe.watchHeading(options).then(
                    function(res) {}, 
                    function(err) {},
                    function(result) {
                        $scope.currHeading = result.head;
                        compWatchID = result.id;
                        if ($scope.phoneUp) {
                            addArElements(result.head);
                        }
                    }
                );
          }
      };
      
      /*Stops compass watch from continuing to read heading values*/
      $scope.clearCompWatch = function() {
          compassServe.clearWatch(compWatchID);
          compWatchID = null;
      };
                                          
      /*Geolocation Intel (was using cordova geolocation at first but got better results using intels geolocation library)*/
      /*Receives position data when there is a change in position. geoWatchIntelID used to reference watch*/
      /*Updates onCampus variable. Updates current marker position. Calls calculateBearing which calculated the heading require to reach all artwork*/
      $scope.watchPositionIntel = function() {
              if (geoWatchIntelID == null) {
                  geoWatchIntelID = intel.xdk.geolocation.watchPosition(function(position) {
                      $scope.currPosition = position;
                      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                      currMarker.setPosition(pos);
                      if(!($scope.campusCircle.getBounds().contains(pos))) {
                         $scope.onCampus = false;
                      }else{
                          $scope.onCampus = true;
                      }
                      currMarker.setPosition(pos);
                      if (!bounds.contains(pos)){
                          bounds.extend(pos);
                          map.fitBounds(bounds);
                      }
                      currMarker.setMap(map);
                      calculateBearing();
                  }, function(err) {
                      //Error
                      alert('error');
                  }, {enableHighAccuracy: true});
              }
        };
      
      /*Stops gps watch from continuing to monitor position*/
      $scope.clearGeoWatchIntel = function() {
          intel.xdk.geolocation.clearWatch(geoWatchIntelID);
      };
      
      /*Start all watches*/
      function startWatches() {
          $scope.watchAcceleration();
          $scope.watchHeading();
          $scope.watchPositionIntel();
      }
      
      /*Stop all watches*/
      function stopWatches() {
          $scope.clearAccWatch();
          $scope.clearCompWatch();
          $scope.clearGeoWatchIntel();
      }
      
      /*Listener for when the scope of this controller is destroyed aka the user navigates to another state. All watches need to be stopped and rootscope variables are reset*/
      $scope.$on("$destroy", function() {
          destroyListeners();
          xdkStopAR();
          stopWatches();
          $rootScope.showTour = false;
          $rootScope.tourPieces = [];
      });
      
      /*Listeners initialized for when device is locked or when app is sent to the background*/
      function initListeners() {
          //pause fires when device locks 
          //when a device is locked the app is sent to background first
          //so locking the screen while in the app fires both pause and suspend event
          document.addEventListener("intel.xdk.device.pause", lock,false);
          //suspend only fires if the app goes into the background
          document.addEventListener("intel.xdk.device.suspend", background,false);
          document.addEventListener("intel.xdk.device.resume", open,false);
      }
      
      /*Deletes any listeners. Listeners are not within the controllers scope but are active everywhere therefore I destroy them when the controller scope is destroyed because I only want to listen for these events in the explore state*/
      function destroyListeners() {
          document.removeEventListener("intel.xdk.device.pause", lock,false);
          document.removeEventListener("intel.xdk.device.suspend", background,false);
          document.removeEventListener("intel.xdk.device.resume", open,false);
      }
      
      /*function called when app sent to background*/
      function background() {
          console.log('SENT TO BACKGROUND');
          xdkStopAR();
          stopWatches();
      }
      
      /*function called when device is locked*/
      function lock() {
          console.log('PHONE LOCKED');
          xdkStopAR();
          stopWatches();
      }
      
      /*function called when app is opened or resumed*/
      function open() {
          console.log('OPEN/RESUME');
          startWatches();
      }
      
      
      /*Starts everything*/
      initMap();
      open();
      initListeners();
      
  }]);

appControllers.controller('searchCtrl', ['$scope','$rootScope',
    function($scope,$rootScope) {
        /*Set scope variables to data stored on localstorage*/
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        
        /*Creates a list of Artist from the Artwork data*/
        $scope.artists = [];
        for (var x=0;x<$scope.artwork.length;x++) {
            var temp = $scope.artwork[x].artist_name;
            if ($scope.artists.indexOf(temp)==-1){
                $scope.artists.push(temp);
            }
        }
        
        /*If true the profile page will have a focus button*/
        $scope.showAdd = true;
        
        /*Variable that will store the artwork which is selected. It will be used to show information on the profile page*/
        $scope.selectedMarker = null;
        
        /*Default order of artwork displayed*/
        $scope.order = 'date_made';
        
        /*Variable to toggle reverse order*/
        $scope.reverse = false;
        
        //closes profile page
        $scope.closeProfile = function(){
            console.log('close profile');
            $scope.selectedMarker=null;
            $rootScope.favActive = false;
            $rootScope.addActive = false;
            $rootScope.focus = $rootScope.someFocus();
        };
        
        //opens profile
        $scope.openProfile = function(art){
            console.log('open profile');
            //$scope.$apply(function () {
                $scope.selectedMarker = art;
                console.log("is fav: "+$rootScope.isFavorite(art.artwork_id));
                $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
                console.log("is focused: "+$rootScope.isFocused(art.artwork_id));
                $rootScope.addActive = $rootScope.isFocused(art.artwork_id);
            //});
        };
        
        /*Uses intel location to get the current position*/
        $scope.getPositionIntel = function() {
            intel.xdk.geolocation.getCurrentPosition(function(position) {
                console.log("Got Position");
                calculateDistance(position);
            }, function(err) {
                //Error
                alert('error');
            });
        };
        
        /*Uses current position to calculate the distance of all artwork*/
        function calculateDistance(pos){
          for (var z=0; z<$scope.artwork.length; z++){
              var pinLat = $scope.artwork[z].location_lat;
              var pinLng = $scope.artwork[z].location_long;
              var dLat = (pos.coords.latitude-pinLat)* Math.PI / 180;
              var dLon = (pos.coords.longitude-pinLng)* Math.PI / 180;
              var lat1 = pinLat * Math.PI / 180;
              var lat2 = pos.coords.latitude * Math.PI / 180;
              
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var distance = 3958.76  * c;
              $scope.artwork[z]['distance']=distance;
          }
        }
        
        /*Sets search input bar to text*/
        $scope.setSearch = function (text) {
            $scope.search = text;
        };

        /*Get position so that the closest artwork can be determined*/
        $scope.getPositionIntel();
        
    }]);