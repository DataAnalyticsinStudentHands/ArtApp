'use strict';

/* Services */
var locationServices = angular.module('locationServicesModule', []);
var utilServices = angular.module('utilModule', []);

locationServices.factory('accelerometerServe', ['$q', function($q) {

  return {
    getCurrentAcceleration: null,
    watchAcceleration: null,
    clearWatch: null
  }
}]);


locationServices.factory('compassServe', ['$q', function($q) {

  return {
    getCurrentHeading: null,
    watchHeading: null,
    clearWatch: null
  }
}]);

locationServices.factory('geolocationServe', ['$q', function($q) {

  return {
    getCurrentPosition: null,
    watchPosition: null,
    clearWatch: null
  }
}]);

utilServices.factory('tourInfo', ['$q', function($q) {

    var tour = null;
    var artwork = null;
    
  return {
    getTour: function(){
        
        return tour;
    },
    setTour: function(input){
        
        tour = input;
    },
    getArtwork: function(){
        
        return artwork;
    },
    setArtwork: function(input){
        
        artwork = input;
    }
  }
}]);