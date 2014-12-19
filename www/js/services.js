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

utilServices.factory('tourInfo', ['$q','Restangular',
                                  function($q,Restangular) {

    var tours = null;
    var artwork = null;
    
  var outOb = {
    loadData: function(){
        
        var artProm = Restangular.all('artobjects').getList();
        
        artProm.then(function(success){
            
            artwork = Restangular.stripRestangular(success);
        },
        function(error){
            
            console.log("Artwork GET request failed");
        });
        
        tours = JSON.parse(localStorage.getItem("tours"));
    },
    getTours: function(){
        
        return tours;
    },
    setTours: function(input){
        
        tours = input;
    },
    getArtwork: function(){
        
        return artwork;
    },
    setArtwork: function(input){
        
        artwork = input;
    },
    getTourByID: function(id){
        
        if(tours){
            
            var temp = tours.filter(function(element){
                
                return element.tour_id == id;
            });
            
            return temp[0];
        }
        else{
            
            return null;
        }
    }
  }
  
  outOb.getArtworkByTourID = function(id){
        
        var tour = outOb.getTourByID(id);
        
        if(tour){
            
            var tourArt = [];
            
            for(var i=0;i<tour.artwork_included.length;i++){
                
                tourArt.push(artwork[tour.artwork_included[i]]);
            }
            
            return tourArt;
        }
        else{
         
            return null;
        }
    }
  
  return outOb;
}]);