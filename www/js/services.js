'use strict';

/* Services */
var utilServices = angular.module('utilModule', []);

utilServices.factory('tourInfo', ['$q','Restangular','$http', '$filter',
    function($q,Restangular,$http,$filter) {

    var tours = null;
    var artwork = null;
    var colArray = null;
        
    // Groups artwork in columns of 3 for box slider purposes
    var genColArray = function(){
        
        var allToursArtwork = [];
        colArray = {};
        
        for(var i=0;i<tours.length;i++){
            
            allToursArtwork[i] = outOb.getArtworkByTourID(tours[i].tour_id);
        }
        
        for(var k=0;k<allToursArtwork.length;k++){
        
            var tourArt = allToursArtwork[k];
            colArray[tours[k].tour_id] = []
            
            for(var i=0;i<Math.ceil(tourArt.length/3);i++){

                colArray[tours[k].tour_id][i] = [];

                for(var j=0;j<3;j++){

                    if(i*3+j<tourArt.length){

                        colArray[tours[k].tour_id][i][j] = tourArt[i*3+j];
                    }
                    else{

                        break;
                    }
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
            
            if(!colArray&&artwork&&tours){
                
                genColArray();
            }
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
                
                if(!colArray&&artwork&&tours){
                
                    genColArray();
                }
            });
            
            // Set tour promise
        }

        if(tempArtwork){

            artwork = tempArtwork;
            
            if(!colArray&&artwork&&tours){
                
                genColArray();
            }
        }
        else{

            var artworkProm = Restangular.all('artobjects').getList();
            
            artworkProm.then(function(success){

                artwork = Restangular.stripRestangular(success);
                localStorage.setItem("tours_version","1.1");
                localStorage.setItem("artwork",JSON.stringify(artwork));
                
                if(!colArray&&artwork&&tours){
                
                    genColArray();
                }
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
  
  outOb.getArtworkByID = function(art_id){

      return $filter('getByArtworkId')(artwork, art_id);
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
  
  outOb.getArtworkCol = function(id){
          
        return genColArray(outOb.getArtworkByTourID(id));
  }
  
  outOb.getArtworkColByTourID = function(id){
      
      if(colArray){
          
          return colArray[id];
      }
      else{
          
          return null;
      }
  }
  
  return outOb;
}]);