'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope','$http','geolocationServe','tourInfo','Restangular',
    function($rootScope, $scope, $http, geolocationServe, tourInfo, Restangular) {
        ionic.Platform.ready(function() {
    //navigator.splashscreen.hide();
  });
        $scope.showAdd = false;
        
        //alert('loaded');
        
        //Uses local storage instead of http requests
        $scope.tours = JSON.parse(localStorage.getItem("tours"));
        //$scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        
        var artProm = Restangular.all('artobjects').getList();
        
        artProm.then(function(success){
            
            
            
            $scope.artwork = Restangular.stripRestangular(success);
            tourInfo.setArtwork($scope.artwork);
            tourInfo.setTourSelected(false);
        },
        function(error){
            
            console.log("Artwork GET request failed");
        });
        
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
        
        $scope.selectedMarker = null;
        
        $scope.tourArt = [];
        
        
        $scope.sliderOptions = {disable: 'right', hyperextensible: false};
//        snapRemote.getSnapper().then(function(snapper) {
//            snapper.open('left');
//        });
        
        /*********************************************/
        /*MY COMMENT STUFF STARTS AT map-canvas!!!!!!*/
        /*********************************************/
        
//        var mapDiv = document.getElementById('map-canvas');
//        var mapOptions = {
//            center: new google.maps.LatLng(29.719950, -95.342234),
//            draggable: false,
//            disableDefaultUI: true,
//            zoom: 16
//        };
//        var map = new google.maps.Map(mapDiv, mapOptions);
//        var markers = [];
//        var bounds = new google.maps.LatLngBounds();
//        
//        //Creates marker object, adds it to map, adds it to markers array
//        function addMarker(location, art) {
//            $scope.tourArt.push(art);
//            var image = {
//                            url: "img/mapmarker.svg",
//                            scaledSize: new google.maps.Size(40,60)
//                            /*size: new google.maps.Size(40, 60),
//                            origin: new google.maps.Point(0,0),
//                            anchor: new google.maps.Point(20, 60)*/
//                          };
//            var marker = new google.maps.Marker({
//                position: location,
//                map: map,
//                icon: image
//            });
//            markers.push(marker);
//            bounds.extend(location);
//            map.fitBounds(bounds);
//            
//            google.maps.event.addListener(marker, 'click', function() {
//                $scope.openProfile(art);
//            });
//        }
//        
//        // Sets the map on all markers in the array.
//        function setAllMap(map) {
//            for (var i = 0; i < markers.length; i++) {
//                markers[i].setMap(map);
//            }
//        }
//
//        // Removes the markers from the map, but keeps them in the array.
//        function clearMarkers() {
//            setAllMap(null);
//        }
//
//        // Shows any markers currently in the array.
//        function showMarkers() {
//            setAllMap(map);
//        }
//
//        // Deletes all markers in the array by removing references to them.
//        function deleteMarkers() {
//            clearMarkers();
//            markers = [];
//            bounds = new google.maps.LatLngBounds();
//        }
//        
//        //closes profile page and resets fav/add button
//        $scope.closeProfile = function(){
//            console.log('close profile');
//            $scope.selectedMarker=null;
//            $rootScope.favActive = false;
//        };
//        
//        //opens profile and set fav/add as active or not
//        $scope.openProfile = function(art){
//          console.log('open profile');
//            $scope.$apply(function () {
//                  $scope.selectedMarker = art;
//                  console.log("is fav: "+$rootScope.isFavorite(art.artwork_id));                         $rootScope.favActive = $rootScope.isFavorite(art.artwork_id);
//            });
//        };
//        

        
        
        
        
        
        //When tour name is clicked the corresponding markers are added.
        $scope.tourClick = function(tour) {
            
            var tourArt = [];
            
            tourInfo.setTour(tour);
            tourInfo.setTourSelected(true);
            
            for(var i=0;i<tour.artwork_included.length;i++){
                
                tourArt.push($scope.artwork[tour.artwork_included[i]]);
            }
            
            tourInfo.setArtwork(tourArt);
            
//            deleteMarkers();
//            $scope.tourArt = [];
//            for(var x=0; x<tour.artwork_included.length; x++){
//                
//                for (var y=0; y<$scope.artwork.length; y++){
//                    
//                    if (tour.artwork_included[x] == $scope.artwork[y].artwork_id){
//                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
//                    }
//                    
//                }
//                
//            }
        };
        
        
        
        
        
//        
//        //adds markers for favorites tour
//        $scope.favTourClick = function() {
//            deleteMarkers();
//            $scope.tourArt = [];
//            $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
//            if ($scope.favorites!=null) {
//                for(var x=0; x<$scope.favorites.length; x++){
//
//                    for (var y=0; y<$scope.artwork.length; y++){
//
//                        if ($scope.favorites[x] == $scope.artwork[y].artwork_id){
//                            addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
//                        }
//
//                    }
//
//                }
//            }else{alert("You don't have any favorites yet!");}
//        };
//        
//        //adds markers for artwork add within the last X months
//        $scope.newTourClick = function() {
//            deleteMarkers();
//            $scope.tourArt = [];
//            for (var y=0; y<$scope.artwork.length; y++){
//                    
//                    if ($scope.artwork[y].date_made > 2000){
//                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
//                    }
//                    
//                }
//        };
        
        //start tour
        $scope.startTour = function() {
            $rootScope.showTour = true;
            $rootScope.tourPieces = $scope.tourArt;
            $state.go('ARtours');
        };
        
        
        $scope.testFunc = function(){
            
            console.log('HEYEYEYEYEYE');
            state.go('search.artwork');
        }
    }]);

appControllers.controller('exploreCtrl', ['$rootScope','$scope', '$http','accelerometerServe','compassServe','geolocationServe',
  function($rootScope, $scope, $http, accelerometerServe, compassServe, geolocationServe) {
      $scope.showAdd = true;
      $rootScope.focus = $rootScope.someFocus();
      
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
      $scope.minD = 100;
      $scope.camInUse = false;
      
      //Uses local storage instead of http requests
//      if ($rootScope.showTour){
//          $scope.artwork = $rootScope.tourPieces;
//      }else{
          $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
//      }
      
      $scope.back = function() { //probably cut
          if ($rootScope.showTour){
              $state.go('tours');
          }else{
              $state.go('index');
          }
      };
      
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
          xdkStopAR();
          $scope.camInUse = true;
          intel.xdk.camera.takePicture(70,true,'jpg');
          function cameraDone() {console.log("Hello");$scope.camInUse = false;;}
          document.addEventListener("intel.xdk.camera.picture.add",cameraDone);
          document.addEventListener("intel.xdk.camera.picture.cancel",cameraDone);
          
      };
      
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
      
      //Toggle AR/Map view
      $scope.toggleView = function(){
          if ($scope.toggle){
              $scope.toggle = false;
          }else{
              $scope.toggle = true;
          }
      };
      
      // start intel.xdk augmented reality mode, adds camera in background       
      function xdkStartAR() {
          //intel.xdk.display.startAR();
          if (document.body.style.backgroundColor!="transparent" && !$scope.camInUse){
              console.log("...Start AR called...");
              document.body.style.backgroundColor="transparent";
              document.body.style.backgroundImage='none';
          }
      }
        
      // stop intel.xdk augmented reality mode        
      function xdkStopAR() {
          //intel.xdk.display.stopAR();
          if (document.body.style.backgroundColor=="transparent" && !$scope.camInUse){
              console.log("...Stop AR called...");
              document.body.style.backgroundColor="#000";
              document.body.style.backgroundImage="url('img/jimsanborn.jpg')";
          }
      } 
      
      //Add elements for AR view given the heading
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
                  //console.log("Closest: "+$scope.artwork[z]['title'] );
                  html += '<h1 align="center" style="position:absolute;top:70%;left:0px;">Look around, your near Art!</h1><img ng-click="selectMarker('+z+','+zInd+
                            ')" src="img/mapmarker.svg" style="position:absolute;left:'+25+
                              '%;top:'+90+
                              '%;width:50%;height:auto;z-index:'+zInd+
                              ';">';
              }else{
                  if(Math.abs($scope.artwork[z]['bearing'] - heading.magneticHeading) <= 20){
                      if ($rootScope.focusedArt.length ===0){
                          html += '<img ng-click="selectMarker('+z+','+zInd+
                                ')" src="img/mapmarker.svg" style="position:absolute;left:'+margin+
                                  '%;bottom:'+top+
                                  '%;width:auto;height:'+scale+
                                  '%;z-index:'+zInd+
                                  ';">';
                      }else if ($rootScope.focusedArt.indexOf($scope.artwork[z]['artwork_id'])>-1){
                          html += '<img ng-click="selectMarker('+z+','+zInd+
                                ')" src="img/mapmarker.svg" style="position:absolute;left:'+margin+
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
      
      $scope.selectMarker = function(art,x){
          $scope.selectedMarker=$scope.artwork[art];
          console.log("z index: "+x);
      };

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
          $rootScope.showTour = false;
          $rootScope.tourPieces = [];
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

appControllers.controller('searchCtrl', ['$scope','$rootScope',
    function($scope,$rootScope) {
        $scope.artwork = JSON.parse(localStorage.getItem("artwork"));
        $scope.artists = [];
        for (var x=0;x<$scope.artwork.length;x++) {
            var temp = $scope.artwork[x].artist_name;
            if ($scope.artists.indexOf(temp)==-1){
                $scope.artists.push(temp);
            }
        }
        
        $scope.showAdd = true;
        
        $scope.selectedMarker = null;
        
        $scope.order = 'date_made';
        
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
        
        $scope.getPositionIntel = function() {
              intel.xdk.geolocation.getCurrentPosition(function(position) {
                  console.log("Got Position");
                  calculateDistance(position);
              }, function(err) {
                  //Error
                  alert('error');
              });
        };
        
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
        
        $scope.setSearch = function (text) {
            $scope.search = text;
        };
        
        $scope.searchFunction = function() {
            return function(dude) {
                
            };
        };

        $scope.getPositionIntel();
        
        
        
    }]);

appControllers.controller('imslideCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate) {
        
        $scope.tourGet = tourInfo.getTour;
        $scope.artworkGet = tourInfo.getArtwork;
        $scope.tourSelected = tourInfo.getTourSelected;
        
        $scope.genImList = function(artOb){
            
            var test = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            
            return test;
        }
        
        $scope.genArtList = function(){
            
            if($scope.tourSelected()){
                
                return $scope.artworkGet();
            }
            else{
                
                return null;
            }
        };
        
        $scope.slideHasChanged = function(index){
            
            console.log($scope.tourGet());
        };
        
        $scope.menuToggle = function(){
            
            $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
        };
        
    }]);