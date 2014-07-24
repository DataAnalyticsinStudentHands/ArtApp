'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope', '$http', 'snapRemote', 'geolocationServe',
    function($rootScope, $scope, $http, snapRemote, geolocationServe) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.tours = JSON.parse(localStorage.getItem("tours"));
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
        
        $scope.selectedMarker = null;
        
        $scope.sliderOptions = {disable: 'right', hyperextensible: false};
        
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
        
        //Creates marker object, adds it to map, adds it to markers array
        function addMarker(location, art) {
            var image = {
                            url: "img/mapmarker.png",
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
        
        // Sets the map on all markers in the array.
        function setAllMap(map) {
            for (var i = 0; i < markers.length; i++) {
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
                  console.log("is fav: "+$rootScope.isFavorite(art.artwork_id));                         $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
            });
        };
        
        //When tour name is clicked the corresponding markers are added.
        $scope.tourClick = function(tour) {
            deleteMarkers();
            for(var x=0; x<tour.artwork_included.length; x++){
                
                for (var y=0; y<$scope.artwork.length; y++){
                    
                    if (tour.artwork_included[x] == $scope.artwork[y].artwork_id){
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                    
                }
                
            }
        };
        
        //adds markers for favorites tour
        $scope.favTourClick = function() {
            deleteMarkers();
            $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
            if ($scope.favorites!=null) {
                for(var x=0; x<$scope.favorites.length; x++){

                    for (var y=0; y<$scope.artwork.length; y++){

                        if ($scope.favorites[x] == $scope.artwork[y].artwork_id){
                            addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                        }

                    }

                }
            }else{alert("You don't have any favorites yet!")}
        };
        
        //adds markers for artwork add within the last X months
        $scope.newTourClick = function() {
            deleteMarkers();
            for (var y=0; y<$scope.artwork.length; y++){
                    
                    if ($scope.artwork[y].date_made > 2000){
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                    
                }
        };
        
    }]);

appControllers.controller('exploreCtrl', ['$rootScope','$scope','$http','accelerometerServe','compassServe','geolocationServe',
  function($rootScope, $scope, $http, accelerometerServe, compassServe, geolocationServe) {
      $scope.showAdd = true;
      
      
      
      
      $scope.selectedMarker = null;
      $scope.currAcc = null;
      var accWatchID = null;
      $scope.currHeading = null;
      var compWatchID = null;
      $scope.currPosition = null;      
      var geoWatchID = null;
      var geoWatchIntelID = null;
      $scope.phoneUp = false;
      $scope.toggle = false;
      $scope.onCampus = true;
      $scope.maxD = 0;
      $scope.minD = 0;
      
      //Uses local storage instead of http requests
      $scope.tours = JSON.parse(localStorage.getItem("tours"));
      $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
      
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
                            url: "img/yourMarker.png",
                            size: new google.maps.Size(27, 41),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(10, 31)
                          };
      var currMarker = new google.maps.Marker({
                            icon:yourMarker
                        });
      var bounds = new google.maps.LatLngBounds();
      $scope.campusCircle = new google.maps.Circle({
              center: new google.maps.LatLng(29.721677, -95.341912),
              radius:1000
      });
      
      //Initializes map markers
      function initMap() {
          map = new google.maps.Map(mapDiv, mapOptions);
          
          for (var y=0; y<$scope.artwork.length; y++){
              addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
          }
          
      }
      
      //Creates marker object, adds it to map, adds it to markers array
      function addMarker(location, art) {
          var image = {
                            url: "img/mapmarker.png",
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
      
      // Sets the map on all markers in the array.
      function setAllMap(map) {
          for (var i = 0; i < markers.length; i++) {
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
      $scope.openCamera = function() {
          intel.xdk.camera.takePicture(70,true,'jpg');
      };
      
      //closes profile page
      $scope.closeProfile = function(){
            console.log('close profile');
            $scope.selectedMarker=null;
            $rootScope.favActive = false;
            $rootScope.addActive = false;
        };
      
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
      
      //Toggle AR/Map view
      $scope.toggleView = function(){
          if ($scope.toggle){
              $scope.toggle = false;
          }else{
              $scope.toggle = true;
          }
      }
      
      // start intel.xdk augmented reality mode, adds camera in background       
      function xdkStartAR() {
          //intel.xdk.display.startAR();
          if (document.body.style.backgroundColor!="transparent"){
              console.log("...Start AR called...");
              document.body.style.backgroundColor="transparent";
              document.body.style.backgroundImage='none';
          }
      }
        
      // stop intel.xdk augmented reality mode        
      function xdkStopAR() {
          //intel.xdk.display.stopAR();
          if (document.body.style.backgroundColor=="transparent"){
              console.log("...Stop AR called...");
              document.body.style.backgroundColor="#000";
              document.body.style.backgroundImage="url('img/jimsanborn.jpg')";
          }
      } 
      
      //Add elements for AR view given the heading
      function addArElements(heading) {
          //console.log('...Compass Direction...');
          var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
          var direction = directions[Math.abs(parseInt((heading.magneticHeading) / 45) + 0)];
          
          var html="";
          for (var z=0; z<$scope.artwork.length; z++) {
              
              if(Math.abs($scope.artwork[z]['bearing'] - heading.magneticHeading) <= 20){
                  console.log($rootScope.focusedArt.indexOf($scope.artwork[z]['artwork_id']));
                  var margin = (((($scope.artwork[z]['bearing'] - heading.magneticHeading)+20)/40)*100)-9;
                  var zInd = (($scope.artwork[z]['distance']-$scope.minD)/($scope.maxD-$scope.minD))*10;
                  var top = ((zInd/10)*20)+45;
                  if ($rootScope.focusedArt.length ===0){
                      html += '<img ng-click="selectMarker('+z+
                            ')" src="img/armarker.png" style="position:absolute;left:'+margin+
                              '%;top:'+top+
                              '%;width:18%;height:auto;z-index:'+zInd+
                              ';border:5px solid yellow">';
                  }else if ($rootScope.focusedArt.indexOf($scope.artwork[z]['artwork_id'])>-1){
                      html += '<img ng-click="selectMarker('+z+
                            ')" src="img/armarker.png" style="position:absolute;left:'+margin+
                              '%;top:'+top+
                              '%;width:18%;height:auto;z-index:'+zInd+
                              ';border:5px solid yellow">';
                  }

              }
          }
          $scope.arHTML = html;
      }
      
      $scope.selectMarker = function(art){
          $scope.selectedMarker=$scope.artwork[art];
      };

      function calculateBearing(){
          console.log('...Calculate Bearing...');
          for (var z=0; z<$scope.artwork.length; z++){
              new google.maps.LatLng($scope.artwork[z].location_lat, $scope.artwork[z].location_long);
              
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
      
      //Accelerometer                                    
      $scope.getAcceleration = function() {
          accelerometerServe.getCurrentAcceleration().then(function(result) {
              $scope.currAcc = result;
          }, function(err) {
              //Error
          });
      };

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
      
      $scope.clearAccWatch = function() {
          accelerometerServe.clearWatch(accWatchID);
          accWatchID = null;
      };
      
      //Compass                                    
      $scope.getHeading = function() {
          compassServe.getCurrentHeading().then(function(result) {
              $scope.currHeading = result;
          }, function(err) {
              //Error
          });
      };
      
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
      
      $scope.clearCompWatch = function() {
          compassServe.clearWatch(compWatchID);
          compWatchID = null;
      };
                                          
      //Geolocation CORDOVA
      $scope.getPosition = function() {
          geolocationServe.getCurrentPosition().then(function(position) {
              $scope.currPosition = position;
              console.log(position);
          }, function(err) {
              //Error
          });
      };

      $scope.watchPosition = function() {
          var gOptions = {maximumAge: 3000, timeout: 6000, enableHighAccuracy: true};
          if (geoWatchID == null) {
              geoWatchID = geolocationServe.watchPosition(gOptions).then(
                  function(res) {},
                  function(err) {},
                  function(result) {
                      $scope.currPosition = result.loc;
                      geoWatchID = result.id;
                      var pos = new google.maps.LatLng(result.loc.coords.latitude, result.loc.coords.longitude);
                      if(!campusCircle.contains(pos)) {
                         $scope.onCampus = false;  
                      }
                      currMarker.setPosition(pos);
                      if (!bounds.contains(pos)){
                          bounds.extend(pos);
                          map.fitBounds(bounds);
                      }
                      currMarker.setMap(map);
                      calculateBearing();
                  }
              );
          }

      };

      $scope.clearGeoWatch = function() {
          geolocationServe.clearWatch(geoWatchID)
      };
      
      //Geolocation INTEL
      $scope.getPositionIntel = function() {
              intel.xdk.geolocation.getCurrentPosition(function(position) {
                  alert('success');
                  addMarker(position, "Intel getPosition");
              }, function(err) {
                  //Error
                  alert('error');
              });
        };
        
      $scope.watchPositionIntel = function() {
              if (geoWatchIntelID == null) {
                  geoWatchIntelID = intel.xdk.geolocation.watchPosition(function(position) {
                      $scope.currPosition = position;
                      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                      currMarker.setPosition(pos);
                      if(!($scope.campusCircle.getBounds().contains(pos))) {
                         $scope.onCampus = false;
                         $scope.toggle = true;
                      }else{
                          $scope.onCampus = true;
                          $scope.toggle = false;
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
        
        $scope.clearGeoWatchIntel = function() {
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
      
      $scope.$on("$destroy", function() {
          destroyListeners();
          xdkStopAR();
          stopWatches();
          
      });
      
      function initListeners() {
          //pause fires when device locks 
          //when a device is locked the app is sent to background first
          //so locking the screen while in the app fires both pause and suspend event
          document.addEventListener("intel.xdk.device.pause", lock,false);
          //suspend only fires if the app goes into the background
          document.addEventListener("intel.xdk.device.suspend", background,false);
          document.addEventListener("intel.xdk.device.resume", open,false);
      }
      
      function destroyListeners() {
          document.removeEventListener("intel.xdk.device.pause", lock,false);
          document.removeEventListener("intel.xdk.device.suspend", background,false);
          document.removeEventListener("intel.xdk.device.resume", open,false);
      }
      
      function background() {
          console.log('SENT TO BACKGROUND');
          xdkStopAR();
          stopWatches();
      }
      
      function lock() {
          console.log('PHONE LOCKED');
          xdkStopAR();
          stopWatches();
      }
      
      function open() {
          console.log('OPEN/RESUME');
          startWatches();
      }
      
      
      //Start everything
      initMap();
      open();
      initListeners();
      
  }]);

appControllers.controller('searchCtrl', ['$scope','geolocationServe',
    function($scope,geolocationServe) {
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        $scope.names = [
    'Lolita Dipietro',
    'Annice Guernsey',
    'Gerri Rall',
    'Ginette Pinales',
    'Lon Rondon',
    'Jennine Marcos',
    'Roxann Hooser',
    'Brendon Loth',
    'Ilda Bogdan',
    'Jani Fan',
    'Grace Soller',
    'Everette Costantino',
    'Andy Hume',
    'Omar Davie',
    'Jerrica Hillery',
    'Charline Cogar',
    'Melda Diorio',
    'Rita Abbott',
    'Setsuko Minger',
    'Aretha Paige'];
    }]);