'use strict';

/* Services */
var utilServices = angular.module('utilModule', []);

utilServices.factory('tourInfo', ['$q','Restangular','$http', '$filter','$ionicSlideBoxDelegate','$ionicLoading',
    function($q,Restangular,$http,$filter,$ionicSlideBoxDelegate,$ionicLoading) {

    var tours = null;
    var artwork = null;
    
var outOb = {
    loadData: function(){

        var tempTours = JSON.parse(localStorage.getItem("tours"));
        var tempArtwork = JSON.parse(localStorage.getItem("artwork"));
        
        // CHECK LOCAL STORAGE FOR TOURS AND ARTWORK
        // IF PRESENT
        if(tempTours){

            $ionicLoading.show();
            
            var tempDate = localStorage.getItem("toursUpdated");
            
            var tourProm = Restangular.all('tours').getList({updated:tempDate});
            
            tourProm.then(function(success){

                
                // 304 Not Modified
                if(success.status == 304){
                    
                    tours = tempTours;
                    
                    tours.forEach(function(curVal, ind, arr){
                
                        if(curVal.artwork_included){

                            curVal.artwork_included = curVal.artwork_included.split(",");
                        }
                    });
                    
                    $ionicLoading.hide();
                }
                else{
                    
                    tours = Restangular.stripRestangular(success.data);
                    localStorage.setItem("tours",JSON.stringify(tours));
                    
                    // Changes artwork_included CSV to array
                    tours.forEach(function(curVal, ind, arr){

                        if(curVal.artwork_included){

                            curVal.artwork_included = curVal.artwork_included.split(",");
                        }
                    });

                    var dateStr = new Date().toISOString();
                    dateStr = dateStr.replace(new RegExp('Z', 'g'), '');
                    localStorage.setItem("toursUpdated",dateStr);
                }
                
                $ionicLoading.hide();
            },
            function(error){
                
                console.log("Tour GET Request Failed");
                $ionicLoading.hide();
            });
            
        }
        else{

            /*********************************
            *** MUST CHANGE TO GET REQUEST ***
            *********************************/
            
            $ionicLoading.show();
            var tourProm = Restangular.all('tours').getList();
            
            tourProm.then(function(success){
                
                tours = Restangular.stripRestangular(success.data);
                localStorage.setItem("tours",JSON.stringify(tours));
                //localStorage.setItem("toursUpdated",);
                
                var dateStr = new Date().toISOString();
                dateStr = dateStr.replace(new RegExp('Z', 'g'), '');
                //localStorage.setItem("toursUpdated",dateStr);
                localStorage.setItem("toursUpdated",dateStr);
                
                tours.forEach(function(curVal, ind, arr){
                
                    if(curVal.artwork_included){
                    
                        curVal.artwork_included = curVal.artwork_included.split(",");
                    }
                });
                
                $ionicLoading.hide();
            },
            function(error){
                
                console.log("Tour GET Request Failed");
                $ionicLoading.hide();
            });
        }

        if(tempArtwork){

            //artwork = tempArtwork;
            
            $ionicLoading.show();
            
            var tempDate = localStorage.getItem("artworkUpdated");
            
            var artworkProm = Restangular.all('artobjects').getList({updated:tempDate});
            
            artworkProm.then(function(success){

                
                // 304 Not Modified
                if(success.status == 304){
                    
                    artwork = tempArtwork;
                    $ionicLoading.hide();
                }
                else{
                    
                    artwork = Restangular.stripRestangular(success.data);
                    localStorage.setItem("artwork",JSON.stringify(artwork));

                    var dateStr = new Date().toISOString();
                    dateStr = dateStr.replace(new RegExp('Z', 'g'), '');
                    //localStorage.setItem("toursUpdated",dateStr);
                    localStorage.setItem("artworkUpdated",dateStr);
                }
                
                $ionicLoading.hide();
            },
            function(error){

                console.log("Artwork GET Request Failed");
                $ionicLoading.hide();
            });
        }
        else{
            $ionicLoading.show();
            var artworkProm = Restangular.all('artobjects').getList();
            
            artworkProm.then(function(success){
                
                    artwork = Restangular.stripRestangular(success.data);
                    localStorage.setItem("artwork",JSON.stringify(artwork));

                    var dateStr = new Date().toISOString();
                    dateStr = dateStr.replace(new RegExp('Z', 'g'), '');
                    localStorage.setItem("artworkUpdated",dateStr);
                
                $ionicLoading.hide();
            },
            function(error){

                // Change to ngNotify
                console.log("Artwork GET request failed");
                $ionicLoading.hide();
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