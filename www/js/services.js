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

utilServices.factory('tourInfo', ['$q','Restangular','$http',
    function($q,Restangular,$http) {

    var tours = null;
    var artwork = null;
    var colArray = null;
        
    // Groups artwork in columns of 3 for box slider purposes
    var genColArray = function(){
        
        colArray = [];
        
        for(var i=0;i<Math.floor(artwork.length/3);i++){
            
            colArray[i] = [];
            
            for(var j=0;j<3;j++){
                
                if(i*j<artwork.length){
                    
                    colArray[i][j] = artwork[i*j];
                }
                else{
                    
                    colArray[i][j] = null;
                }
            }
        }
    }
    
  var outOb = {
    loadData: function(){

        var tempTours = JSON.parse(localStorage.getItem("tours"));
        var tempArtwork = JSON.parse(localStorage.getItem("artwork"));

        // CHECK LOCAL STORAGE FOR TOURS AND ARTWORK
        // IF PRESENT
        if(tempTours){

            tours = tempTours;
        }
        else{

            /*********************************
            *** MUST CHANGE TO GET REQUEST ***
            *********************************/

            /*Reads tour.json and set data into localstorage only if there is new version*/
            $http.get('tours.json').success(function(data) {
                localStorage.setItem("tours_version","1.1");
                localStorage.setItem("tours",JSON.stringify(data));
                tours = tempTours;
            });
            
            // Set tour promise
        }

        if(tempArtwork){

            artwork = tempArtwork;
            
            
        }
        else{

            artworkProm = Restangular.all('artobjects').getList();
            
            artworkProm.then(function(success){

                artwork = Restangular.stripRestangular(success);
                localStorage.setItem("tours_version","1.1");
                localStorage.setItem("artwork",JSON.stringify(artwork));
                
            },
            function(error){

                // Change to ngNotify
                console.log("Artwork GET request failed");
            });
        }
    },
//    getTours: function(){
//
//        this;
//        
//        if(!tours){
//            
//            this.loadData();
//        }
//        
//        return tours;
//    },
    setTours: function(input){

        tours = input;
    },
//    getArtwork: function(){
//
//        this;
//        
//        if(!artwork){
//            
//            this.loadData();
//        }
//        
//        return artwork;
//    },
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
//    getArtworkByTourID: function(id){
//
//        var tour = this.getTourByID(id);
//
//        if(tour){
//
//            var tourArt = [];
//
//            for(var i=0;i<tour.artwork_included.length;i++){
//
//                tourArt.push(artwork[tour.artwork_included[i]]);
//            }
//
//            return tourArt;
//        }
//        else{
//
//            return null;
//        }
//    }
  }
  
  outOb.getTours = function(){
        
        return tours;
    }
  
  outOb.getArtwork = function(){
        
        return artwork;
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