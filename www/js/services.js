'use strict';

/* Services */
var utilServices = angular.module('utilModule', []);

utilServices.factory('tourInfo', ['$q','Restangular','$http', '$filter','$ionicSlideBoxDelegate',
    function($q,Restangular,$http,$filter,$ionicSlideBoxDelegate) {

    var tours = null;
    var artwork = null;
    
var outOb = {
    loadData: function(){

        var tempTours = JSON.parse(localStorage.getItem("tours"));
        var tempArtwork = JSON.parse(localStorage.getItem("artwork"));
        
        // CHECK LOCAL STORAGE FOR TOURS AND ARTWORK
        // IF PRESENT
        if(tempTours){

            tours = tempTours;
            
            // Changes artwork_included CSV to array
            tours.forEach(function(curVal, ind, arr){
                
                if(curVal.artwork_included){
                    
                    curVal.artwork_included = curVal.artwork_included.split(",");
                }
            });
            
        }
        else{

            /*********************************
            *** MUST CHANGE TO GET REQUEST ***
            *********************************/

            /*Reads tour.json and set data into localstorage only if there is new version*/
            $http.get('tours.json').success(function(data) {
                localStorage.setItem("tours_version","1.1");
                localStorage.setItem("tours",JSON.stringify(data));
                tours = data;
                
                // Changes artwork_included CSV to array
                tours.forEach(function(curVal, ind, arr){
                
                    if(curVal.artwork_included){
                    
                        curVal.artwork_included = curVal.artwork_included.split(",");
                    }
                });
            });
            
            // Set tour promise
        }

        if(tempArtwork){

            artwork = tempArtwork;
        }
        else{

            var artworkProm = Restangular.all('artobjects').getList();
            
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
    setTours: function(input){

        tours = input;
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
  
  return outOb;
}]);

utilServices.factory('favoriteService', function() {
    return {
        setFavorite: function (id,toggle) {
            id = eval(id);
            var temp = [];
            if (localStorage.getObject("favorites")!=null) {
                temp = JSON.parse(localStorage.getObject("favorites"));
            } 

            if (toggle){
                temp.push(id);
            }else{
                var index = temp.indexOf(id);
                if (index > -1) {
                    temp.splice(index, 1);
                }
            }
            localStorage.setObject("favorites",JSON.stringify(temp));
        },
        isFavorite: function (id) {
            var temp = []
            if (localStorage.getObject("favorites")!=null) {
                temp = JSON.parse(localStorage.getObject("favorites"));
            }

            for(var q=0; q<temp.length;q++) {
                if (temp[q]==id){
                    return true; 
                }
            }
            return false;
        },
        getFavorites: function() {
            return eval(localStorage.getObject("favorites"));
        }
    }
});

utilServices.factory('appStateStore', function() {
    
    var toursOpen = null;
    var artworkOpen = null;
    var menuOpen = null;
    
    return {
        
        loadData: function(){
            
            toursOpen = JSON.parse(localStorage.getItem("toursOpen"));
            artworkOpen = JSON.parse(localStorage.getItem("artworkOpen"));
            menuOpen = JSON.parse(localStorage.getItem("menuOpen"));
            
            // If nothing in LS, set to default values
            if(toursOpen===null){
                
                localStorage.setItem("toursOpen",true);
                toursOpen = true;
            }
            if(artworkOpen===null){
                
                localStorage.setItem("artworkOpen",false);
                artworkOpen = false;
            }
            if(menuOpen===null){
                
                localStorage.setItem("menuOpen",true);
                menuOpen = true;
            }
            
        },
        getToursOpen: function(){
            
            return toursOpen;
        },
        setToursOpen: function(input){
            
            if(input != toursOpen){
                
                localStorage.setItem("toursOpen",input.toString());
                toursOpen = input;
            }
        },
        getArtworkOpen: function(){
            
            return artworkOpen;
        },
        setArtworkOpen: function(input){
            
            if(input != artworkOpen){
                
                localStorage.setItem("artworkOpen",input.toString());
                artworkOpen = input;
            }
        },
        getMenuOpen: function(){
            
            return menuOpen;
        },
        setMenuOpen: function(input){
            
            if(input != menuOpen){
                
                localStorage.setItem("menuOpen",input.toString());
                menuOpen = input;
            }
        }
    }
});