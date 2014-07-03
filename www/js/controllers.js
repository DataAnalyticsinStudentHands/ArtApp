'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);
appControllers.controller('exploreCtrl', ['$scope','accelerometerServe','compassServe','geolocationServe',
  function($scope, accelerometerServe, compassServe, geolocationServe) {
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
        
      
      // start intel.xdk augmented reality mode, adds camera in background       
      function xdkStartAR() {
          console.log('start ar');
           //intel.xdk.display.startAR(); 
      }
        
      // stop intel.xdk augmented reality mode        
      function xdkStopAR() {
          console.log('stop ar')
          //intel.xdk.display.stopAR(); 
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
              function(err) {},
              function(result) {
                  console.log(result.acc);
                  console.log(result.id);
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


appControllers.controller('tourListCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $http.get('tours.json').success(function(data) {
            $scope.tours = data;
        });            
        
        $scope.openMenu = false;
        $scope.toggleMenu = function () {
            $scope.$emit('toggleSlideMenu', $scope.openMenu = !$scope.openMenu);
        };

        $scope.$on('slideMenuToggled', function (event, isOpen) {
            $scope.openMenu = isOpen;
        });
    }]);