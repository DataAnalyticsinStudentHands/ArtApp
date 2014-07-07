'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);
appControllers.controller('exploreCtrl', ['$scope','$http','accelerometerServe','compassServe','geolocationServe',
  function($scope, $http, accelerometerServe, compassServe, geolocationServe) {
      $scope.hello = true;

      $scope.button = function(){
          if (accWatchID){
              $scope.clearAccWatch();
              
          }else{
              $scope.watchAcceleration();
          }
      };
      
      $scope.currAcc = null;
      var accWatchID = null;
      $scope.currHeading = null;
      var compWatchID = null;
      $scope.currPosition = null;      
      var geoWatchID = null;
      
      $http.get('artwork.json').success(function(data) {
            $scope.artwork = data;
            initMap();
        });
      
      var mapDiv = document.getElementById('map-canvas');
      var mapOptions = {
          center: new google.maps.LatLng(29.719950, -95.342234),
          draggable: true,
          disableDefaultUI: false,
          zoom: 14
      };
      var map = null;
      var markers = [];
      $scope.selectedMarker = null;
      var bounds = new google.maps.LatLngBounds();
      //Initializes map markers
      function initMap() {
          map = new google.maps.Map(mapDiv, mapOptions);
          
          for (var y=0; y<$scope.artwork.length; y++){
              addMarker(new google.maps.LatLng($scope.artwork[y].location_lat, $scope.artwork[y].location_long), $scope.artwork[y]);
          }
      }
      //Creates marker object, adds it to map, adds it to markers array
      function addMarker(location, art) {
          var marker = new google.maps.Marker({
              position: location,
              map: map,
              animation: google.maps.Animation.DROP
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
      
      $scope.xdkReady = false;
      var onDeviceR=function(){
  
        console.log('xdk ready');
        $scope.xdkReady = true;
        
            
        };
        document.addEventListener("intel.xdk.device.ready",onDeviceR,false);   
      
      // start intel.xdk augmented reality mode, adds camera in background       
      function xdkStartAR() {
          console.log('start ar');
          if ($scope.xdkReady){
              intel.xdk.display.startAR();
          }else{alert('not working');}
      }
        
      // stop intel.xdk augmented reality mode        
      function xdkStopAR() {
          console.log('stop ar')
          if ($scope.xdkReady){
              intel.xdk.display.stopAR();
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
          accWatchID = accelerometerServe.watchAcceleration(aOptions).then(
              function (res) {},
              function(err) {alert(err);},
              function(result) {
                  console.log(result.acc);
                  console.log(result.id);
                  $scope.currAcc = result.acc;
                  accWatchID = result.id;
                  if (result.acc.y > 7.5){
                      $scope.phoneUp = true;
                      //xdkStartAR();
                  }else if (result.acc.y < 6){
                      $scope.phoneUp = false;
                      //xdkStopAR();
                  }
              }
          );
      };
      
      $scope.clearAccWatch = function() {
          accelerometerServe.clearWatch(accWatchID);  
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
          var options = { frequency: 3000 }; // Update every 3 seconds
            compassServe.watchHeading(options).then(
                function(res) {}, 
                function(err) {},
                function(result) {
                    console.log(result.head);
                    console.log(result.id);
                    $scope.currHeading = result.head;
                    compWatchID = result.id;
                });
      };
      
      $scope.clearCompWatch = function() {
          compassServe.clearWatch(compWatchID);
      };
      
                                          
      //Geolocation                                    
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
          geolocationServe.watchPosition().then(
              function(res) {},
              function(err) {},
              function(result) {
                  console.log(result.loc.coords);
                  console.log(result.id);
                  $scope.currPosition = result.loc;
                  geoWatchID = result.id;
              }
          );
          
      };
      
      $scope.clearGeoWatch = function() {
          geolocationServe.clearWatch(geoWatchID)
      };
        
      
  }]);


appControllers.controller('tourListCtrl', ['$scope', '$http', 'snapRemote', 
    function($scope, $http, snapRemote) {
        $http.get('tours.json').success(function(data) {
            $scope.tours = data;
        });            
        
        $http.get('artwork.json').success(function(data) {
            $scope.artwork = data;
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
            snapper.open('left');
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
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                animation: google.maps.Animation.DROP
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
        
        
        
        
    }]);


appControllers.controller('testCtrl', ['$scope', 
    function($scope) {
        
        
        $scope.onDeviceR=function(){
            console.log('xdk ready');
            if ($scope.arMode){
                xdkStopAR();
            } else {
                xdkStartAR();
            }
        };
        document.addEventListener("intel.xdk.device.ready",$scope.onDeviceR,false);   
        // start intel.xdk augmented reality mode, adds camera in background       
        
        $scope.arMode = false;
        function xdkStartAR() {
            console.log('start ar');
            intel.xdk.display.startAR();
            //$('#arView').css('background-color','transparent');
            //$('body').css('background-color','transparent');
            document.body.style.backgroundColor="transparent";
            $scope.arMode = true;
        }
        
        // stop intel.xdk augmented reality mode        
        function xdkStopAR() {
            console.log('stop ar');
            intel.xdk.display.stopAR();
            document.body.style.backgroundColor="#8a81e3"
            $scope.arMode = false;
            
        }
        
    }]);