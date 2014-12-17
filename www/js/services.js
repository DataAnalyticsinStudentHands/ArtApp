'use strict';

/* Services */
var locationServices = angular.module('locationServicesModule', []);

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