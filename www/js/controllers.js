'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$scope', '$http', 'snapRemote', 'geolocationServe',
    function($scope, $http, snapRemote, geolocationServe) {
        $http.get('tours.json').success(function(data) {
            $scope.tours = data;
            console.log("JSON (tour.json) read sucess: ");
        });            
        
        $http.get('artwork.json').success(function(data) {
            $scope.artwork = data;
            console.log("JSON (artwork.json) read sucess: ");
        }); 
        
        $scope.sliderOptions = {disable: 'right', hyperextensible: false};
        /*settings = {element: null,
                    dragger: null,
                    disable: 'none',
                    addBodyClasses: true,
                    hyperextensible: true,
                    resistance: 0.5,
                    flickThreshold: 50,
                    transitionSpeed: 0.3,
                    easing: 'ease',
                    maxPosition: 266,
                    minPosition: -266,
                    tapToClose: true,
                    touchToDrag: true,
                    slideIntent: 40,
                    minDragDistance: 5
                    };*/
        
        snapRemote.getSnapper().then(function(snapper) {
            //snapper.open('left');
        });
        
        var mapDiv = document.getElementById('map-canvas');
        var mapOptions = {
            center: new google.maps.LatLng(29.719950, -95.342234),
            draggable: false,
            disableDefaultUI: true,
            zoom: 16
        };
        var map = new google.maps.Map(mapDiv, mapOptions);
        
        var markers = [];
        $scope.selectedMarker = null;
        var bounds = new google.maps.LatLngBounds();
        
        //Creates marker object, adds it to map, adds it to markers array
        function addMarker(location, art) {
            var image = {
                            url: "img/mapmarker.png",
                            size: new google.maps.Size(27, 41),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(10, 31)
                          };
            console.log("...Add Marker called...");
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: image
            });
            markers.push(marker);
            bounds.extend(location);
            map.fitBounds(bounds);
            
            google.maps.event.addListener(marker, 'click', function() {
                console.log(art.title);
                $scope.$apply(function () {
                        $scope.selectedMarker = art;
                    });
                
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
            console.log("...Clear Markers called...");
            setAllMap(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setAllMap(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            console.log("...Delete Markers called...");
            clearMarkers();
            markers = [];
            bounds = new google.maps.LatLngBounds();
        }
        
        //When tour name is clicked the corresponding markers are added.
        $scope.tourClick = function(tour) {
            console.log("Tour Clicked:");
            deleteMarkers();
            for(var x=0; x<tour.artwork_included.length; x++){
                
                for (var y=0; y<$scope.artwork.length; y++){
                    
                    if (tour.artwork_included[x] == $scope.artwork[y].artwork_id){
                        addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
                    }
                    
                }
                
            }
        };
        
    }]);

appControllers.controller('exploreCtrl', ['$scope','$http','accelerometerServe','compassServe','geolocationServe',
  function($scope, $http, accelerometerServe, compassServe, geolocationServe) {
      
      $scope.currAcc = null;
      var accWatchID = null;
      $scope.currHeading = null;
      var compWatchID = null;
      $scope.currPosition = null;      
      var geoWatchID = null;
      var geoWatchIntelID = null;
      $scope.phoneUp = false;
      
      $http.get('artwork.json').success(function(data) {
            $scope.artwork = data;
            console.log("JSON read sucess: ");
            initMap();
            open();
            initListeners();
        });
      
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
      $scope.selectedMarker = null;
      var bounds = new google.maps.LatLngBounds();
      
      //Initializes map markers
      function initMap() {
          console.log("...Initialize Map called...");
          map = new google.maps.Map(mapDiv, mapOptions);
          
          for (var y=0; y<$scope.artwork.length; y++){
              addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
          }
      }
      
      //Creates marker object, adds it to map, adds it to markers array
      function addMarker(location, art) {
          console.log("...Add Marker called...");
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
              console.log(art.title);
              $scope.$apply(function () {
                  $scope.selectedMarker = art;
              });
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
      
      // start intel.xdk augmented reality mode, adds camera in background       
      function xdkStartAR() {
          console.log("...Start AR called...");
          intel.xdk.display.startAR();
          if (document.body.style.backgroundColor!="transparent"){
              document.body.style.backgroundColor="transparent";
              document.body.style.backgroundImage='none';
          }
      }
        
      // stop intel.xdk augmented reality mode        
      function xdkStopAR() {
          console.log("...Stop AR called...");
          intel.xdk.display.stopAR();
          if (document.body.style.backgroundColor=="transparent"){
              document.body.style.backgroundColor="#000";
              document.body.style.backgroundImage="url('img/jimsanborn.jpg')";
          }
      } 
      
      //Add elements for AR view given the heading
      function addArElements(heading) {
          console.log('...Compass Direction...');
          var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
          var direction = directions[Math.abs(parseInt((heading.magneticHeading) / 45) + 0)];
          //document.getElementById('compass').innerHTML = Math.round(heading.magneticHeading) + "      " + direction;
          
          document.getElementById('arElements').innerHTML="";
          var div = document.createElement('div');
          var text = "";
          
          /*for (var z=0; z<$scope.artwork.length; z++) {*/
          for (var z=0; z<5; z++) {
              if(Math.abs($scope.artwork[z]['bearing'] - heading.magneticHeading) <= 20){
                  console.log('...Add AR Elements...');
                  /*var margin = (($scope.artwork[z]['bearing'] - heading.magneticHeading)/40)+0.5;*/
                  var margin = (($scope.artwork[z]['bearing'] - heading.magneticHeading)/20)*(window.innerWidth/2);
                  text+='<div style="color:#000"><img src="img/armarker.png" style="margin-left:'+margin+'px">'+$scope.artwork[z].title +'</div>'
                  
                  /*var margin = (($scope.artwork[z]['bearing'] - heading.magneticHeading)/20)*(window.innerWidth/2);
                  text+='<div style="margin-left:'+margin+'px;color:#000">'+$scope.artwork[z].title +'</div><div style="color:#fff818;margin-left:'+window.innerWidth/2+'">'+Math.round($scope.artwork[z]['bearing'] - heading.magneticHeading) +'</div>';*/
              }
          }
          
          div.innerHTML = text;
          document.getElementById('arElements').appendChild(div);
      }

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
          console.log('...Watch Acceleration called...');
          var aOptions = {frequency: 1000};
          if (accWatchID == null) {
              accWatchID = accelerometerServe.watchAcceleration(aOptions).then(
                  function (res) {},
                  function(err) {alert(err);},
                  function(result) {
                      $scope.currAcc = result.acc;
                      accWatchID = result.id;
                      if (result.acc.y > 7.5){
                          $scope.phoneUp = true;
                          xdkStartAR();
                      }else if (result.acc.y < 6){
                          $scope.phoneUp = false;
                          xdkStopAR();
                      }
                  }
              );
            }
      };
      
      $scope.clearAccWatch = function() {
          console.log('...Clear Acceleration Watch called...');
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
          console.log('...Watch Heading called...');
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
          console.log('...Clear Compass Watch called...');
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
          console.log('...Watch Position called...');
          var gOptions = {maximumAge: 3000, timeout: 6000, enableHighAccuracy: true};
          if (geoWatchID == null) {
              geoWatchID = geolocationServe.watchPosition(gOptions).then(
                  function(res) {},
                  function(err) {},
                  function(result) {
                      $scope.currPosition = result.loc;
                      geoWatchID = result.id;
                      var pos = new google.maps.LatLng(result.loc.coords.latitude, result.loc.coords.longitude);
                      currMarker.setPosition(pos);
                      bounds.extend(pos);
                      map.fitBounds(bounds);
                      currMarker.setMap(map);
                      calculateBearing();
                  }
              );
          }

      };

      $scope.clearGeoWatch = function() {
          console.log('...Clear Geo Watch called...');
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
              console.log('...Watch Position called...');
              if (geoWatchIntelID == null) {
                  geoWatchIntelID = intel.xdk.geolocation.watchPosition(function(position) {
                      $scope.currPosition = position;
                      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                      currMarker.setPosition(pos);
                      bounds.extend(pos);
                      map.fitBounds(bounds);
                      currMarker.setMap(map);
                      calculateBearing();
                  }, function(err) {
                      //Error
                      alert('error');
                  }, {enableHighAccuracy: true});
              }
        };
        
        $scope.clearGeoWatchIntel = function() {
            console.log('...Clear Geo Watch called...');
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
          console.log("$DESTROY caught:");
          destroyListeners();
          xdkStopAR();
          stopWatches();
          
      });
      
      function initListeners() {
          console.log('...Initilize Listeners called...');
          //pause fires when device locks 
          //when a device is locked the app is sent to background first
          //so locking the screen while in the app fires both pause and suspend event
          document.addEventListener("intel.xdk.device.pause", lock,false);
          //suspend only fires if the app goes into the background
          document.addEventListener("intel.xdk.device.suspend", background,false);
          document.addEventListener("intel.xdk.device.resume", open,false);
      }
      
      function destroyListeners() {
          console.log('...Destroy Listeners called...');
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
      
  }]);

appControllers.controller('testCtrl', ['$scope','geolocationServe',
    function($scope,geolocationServe) {
        
        var arDiv = document.getElementById('arElements');
        arDiv.innerHTML = "HELLO";
        
        var div = document.createElement('div');
        var text = "";
        $scope.button = function() {
            for (var z=0; z<8; z++) {
                console.log(z);
                text+='<div> Hello '+z+'</div>';
            }
            div.innerHTML = text;
            document.getElementById('arElements').appendChild(div);
        };
        
        
        /*var mapDiv = document.getElementById('map-canvas');
        var mapOptions = {
              center: new google.maps.LatLng(29.719950, -95.342234),
              draggable: true,
              disableDefaultUI: false,
              zoom: 14
        };
        var map = null;
        var markers = [];
        var bounds = new google.maps.LatLngBounds();
        
        console.log("...Initialize Map called...");
        map = new google.maps.Map(mapDiv, mapOptions);
        
        
        $scope.getPositionCordova = function() {
              geolocationServe.getCurrentPosition().then(function(position) {
                  alert('success');
                  addMarker(position, "Cordova getPosition");
              }, function(err) {
                  //Error
                  alert('error');
              });
        };
        
        $scope.getPositionCordovaHigh = function() {
              geolocationServe.getCurrentPosition({timeout: 15000,enableHighAccuracy: true}).then(function(position) {
                  alert('success');
                  addMarker(position, "Cordova getPosition");
              }, function(err) {
                  //Error
                  alert('error');
              });
        };
        
        $scope.getPositionIntel = function() {
              intel.xdk.geolocation.getCurrentPosition(function(position) {
                  alert('success');
                  addMarker(position, "Intel getPosition");
              }, function(err) {
                  //Error
                  alert('error');
              });
        };
        
        $scope.watchTimer = null;
        $scope.watchPositionIntel = function() {
            var currMarker = new google.maps.Marker({
                  position: new google.maps.LatLng(29.719950, -95.342234),
                  map: map
              });
            markers.push(currMarker);
              $scope.watchTimer = intel.xdk.geolocation.watchPosition(function(position) {
                  alert('success');
                  currMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                  bounds.extend(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                    map.fitBounds(bounds);
              }, function(err) {
                  //Error
                  alert('error');
              }, {enableHighAccuracy: true});
        };
        
        $scope.clearWatch = function() {
            intel.xdk.geolocation.clearWatch($scope.watchTimer);
        };
        
        
        
          function addMarker(location, text) {
              console.log("...Add Marker called...");
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(location.coords.latitude,location.coords.longitude),
                  map: map
              });
              markers.push(marker);
              bounds.extend(new google.maps.LatLng(location.coords.latitude,location.coords.longitude));
              map.fitBounds(bounds);
            
              var infowindow = new google.maps.InfoWindow({
                  content: text + '<br>' + 'Accuracy: '+location.coords.accuracy+'<br>'+'Timestamp: '+location.timestamp
              });

              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(map, marker);
              });
          }
        
            // Deletes all markers in the array by removing references to them.
          $scope.deleteMarkers = function() {
              clearMarkers();
              markers = [];
              bounds = new google.maps.LatLngBounds();
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
*/
          
      
    }]);