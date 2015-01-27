// implementation of AR-Experience (aka "World")
var World = {
	//  user's latest known location, accessible via userLocation.latitude, userLocation.longitude, userLocation.altitude
	userLocation: null,

	// true once data was fetched
	initiallyLoadedData: false,
    
    firstLoad: true,

	// different POI-Marker assets
//	markerDrawable_idle: new AR.ImageResource("assets/mapmarker.png"),
//	markerDrawable_selected: new AR.ImageResource("assets/yourMarker.png"),
//	markerDrawable_directionIndicator: new AR.ImageResource("assets/indi.png"),

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],
    tourID: null,

	// The last selected marker
	currentMarker: null,

	locationUpdateCounter: 0,
	updatePlacemarkDistancesEveryXLocationUpdates: 1,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
        
        // show radar & set click-listener
        AR.context.destroyAll();
        AR.context.scene.cullingDistance = 250;

        World.markerDrawable_idle = new AR.ImageResource("assets/mapmarker.png");
        World.markerDrawable_selected = new AR.ImageResource("assets/yourMarker.png");
        World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

        PoiRadar.show();
        $('#radarContainer').unbind('click');
        $("#radarContainer").click(PoiRadar.clickedRadar);

        World.currentMarker = null;
        World.onMarkerDeselected();
        
		// empty list of visible markers
		World.markerList = [];

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			World.markerList.push(new Marker(poiData[currentPlaceNr]));
		}

		// updates distance information of all placemarks
		World.updateDistanceToUserValues();

        // set distance slider to 100%
        var maxRangeMeters = 100;

        while(World.getNumberOfVisiblePlacesInRange(maxRangeMeters) < 5 && World.getNumberOfVisiblePlacesInRange(maxRangeMeters) != poiData.length) {
              maxRangeMeters += 100;
        }

        $("#panel-distance-range").val(Math.round(maxRangeMeters/World.getMaxDistance() * 100));

        World.updateRangeValues();
        $("#popupLoading").popup("close");
        // If closeForever LS entry has not been created
        if(!localStorage.getItem("closeForever")){
            $("#popupDialog").popup("open");
        }

        World.firstLoad = false;
	},

	// sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
	updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
		for (var i = 0; i < World.markerList.length; i++) {
			World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
		}
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {
		// store user's current location in World.userLocation, so you always know where user is
        
		World.userLocation = {
			'latitude': lat,
			'longitude': lon,
			'altitude': alt,
			'accuracy': acc
		};
        
        switch(acc){
                
            case 1:
                $("#popupInfo #status-message").text("GPS Signal: Weak");
                var icon = $("#popupInfoButton .ui-btn-inner .ui-icon");
                icon.removeClass();
                icon.addClass("ui-icon ui-icon-signal-bars-1 ui-icon-shadow");
                
                //$("#popupInfo .ui-btn-inner .ui-icon").text("GPS Signal: Weak");
                break;
                
            case 2:
                $("#popupInfo #status-message").text("GPS Signal: Moderate");
                var icon = $("#popupInfoButton .ui-btn-inner .ui-icon");
                icon.removeClass();
                icon.addClass("ui-icon ui-icon-signal-bars-2 ui-icon-shadow");
                
                //$("#popupInfo #status-message").text("GPS Signal: Weak");
                break;
                
            case 3:
                $("#popupInfo #status-message").text("GPS Signal: Strong");
                var icon = $("#popupInfoButton .ui-btn-inner .ui-icon");
                icon.removeClass();
                icon.addClass("ui-icon ui-icon-signal-bars-4 ui-icon-shadow");
                
                //$("#popupInfo #status-message").text("GPS Signal: Weak");
                break;
                
        }
        
        console.log(World.userLocation);

		// helper used to update placemark information every now and then (e.g. every 10 location upadtes fired)
		World.locationUpdateCounter = (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);
        if(World.locationUpdateCounter == 0) {
            World.updateDistanceToUserValues();
        }
        if(World.currentMarker && World.currentMarker.isSelected){
            var distanceToUserValue = (World.currentMarker.distanceToUser > 999) ? ((World.currentMarker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(World.currentMarker.distanceToUser) + " m");
            $("#poi-detail-distance").text(distanceToUserValue);
            World.currentMarker.updateDistanceLabel(World.currentMarker, distanceToUserValue);
            if(World.currentMarker.distanceToUser < 10.0) {
                $("#popupArrived").popup("open");
                if(World.currentMarker){
                    for (var i = 0; i < World.markerList.length; i++) {
                        if(World.markerList[i].isSelected) {
                            World.currentMarker.setDeselected(World.markerList[i]);
                        }
                    };
                }                
            }
        }
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {
        //deselect all markers before performing a click
        if(World.currentMarker){
            for (var i = 0; i < World.markerList.length; i++) {
                if(World.markerList[i].isSelected) {
                    World.currentMarker.setDeselected(World.markerList[i]);
                }
            };
        }
        
        World.currentMarker = marker;
        World.currentMarker.setSelected(World.currentMarker);

        var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");

        // update panel values
        $("#art-title .ui-btn-text").text(marker.poiData.title);
        $("#div-art-title").show("fast");
        $("#poi-detail-distance").text(distanceToUserValue);
        $("#div-poi-detail-distance").show("fast");

        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);
        $("#poi-detail-image").attr("src","http://www.housuggest.org/images/ARtour/" + marker.poiData.artwork_id +"/"+ marker.poiData.image.split(",")[0]);

        $(".ui-panel-dismiss" ).unbind("mousedown");
        
        World.currentMarker.updateDistanceLabel(World.currentMarker, distanceToUserValue);
	},
    
    onMarkerDeselected: function markerDeselected() {
        $("#div-art-title").hide();
        $("#div-poi-detail-distance").hide();
    },
    
    showInfo: function showInfoFn() {
        // show panel
        if(World.currentMarker) {
            document.location = 'architectsdk://artInfo?id=' + World.currentMarker.poiData.artwork_id;
        }
    },

	// returns distance in meters of placemark with maxdistance * 1.1
	getMaxDistance: function getMaxDistanceFn() {
		// sort palces by distance so the first entry is the one with the maximum distance
		World.markerList.sort(World.sortByDistanceSortingDescending);

		// use distanceToUser to get max-distance
		var maxDistanceMeters = World.markerList[0].distanceToUser;

		// return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
		return maxDistanceMeters * 1.1;
	},

	// udpates values show in "range panel"
	updateRangeValues: function updateRangeValuesFn() {
		// get current slider value (0..100);
		var slider_value = $("#panel-distance-range").val();

		// max range relative to the maximum distance of all visible places
        var maxRangeMeters = Math.round(World.getMaxDistance() * (slider_value / 100));
        
		// range in meters including metric m/km
		var maxRangeValue = (maxRangeMeters > 999) ? ((maxRangeMeters / 1000).toFixed(2) + " km") : (Math.round(maxRangeMeters) + " m");

		// number of places within max-range
		var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

		// update UI labels accordingly
		$("#panel-distance-value").html(maxRangeValue);
		$("#panel-distance-places").html((placesInRange != 1) ? (placesInRange + " Places") : (placesInRange + " Place"));

		// update culling distance, so only palces within given range are rendered
		AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);

		// update radar's maxDistance so radius of radar is updated too
		PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
	},

	// returns number of places with same or lower distance than given range
	getNumberOfVisiblePlacesInRange: function getNumberOfVisiblePlacesInRangeFn(maxRangeMeters) {
		// sort markers by distance
		World.markerList.sort(World.sortByDistanceSorting);

		// loop through list and stop once a placemark is out of range ( -> very basic implementation )
		for (var i = 0; i < World.markerList.length; i++) {
			if (World.markerList[i].distanceToUser > maxRangeMeters) {
				return i;
			}
		};

        // in case no placemark is out of range -> all are visible
		return World.markerList.length;
	},

    // display range slider
	showRange: function showRangeFn() {
        // update labels on every range movement
        $('#panel-distance-range').change(function() {
            World.updateRangeValues();
        });

        World.updateRangeValues();
        
		$("#panel-distance").on("panelclose", function(event, ui) {
			$("#radarContainer").addClass("radarContainer_left");
			$("#radarContainer").removeClass("radarContainer_right");
			PoiRadar.updatePosition();
		});

		$("#panel-distance").on("panelopen", function(event, ui) {
			$("#radarContainer").removeClass("radarContainer_left");
			$("#radarContainer").addClass("radarContainer_right");
			PoiRadar.updatePosition();
		});

        // open panel
        $("#panel-distance").trigger("updatelayout");
        $("#panel-distance").panel("open", 1234);
	},
    
    showTour: function showTourFn(tourName, tourID) {
        $("#tour-title .ui-btn-text").text(tourName);
        $("#div-tour-title").show("fast");
        World.tourID = tourID;
    },
    
    hideTour: function removeTourFn() {
        $("#div-tour-title").hide();
    },
    
    showTourInfo: function showTourFn() {
        document.location = 'architectsdk://tourInfo?id=' + World.tourID;
    },

	// helper to sort places by distance
	sortByDistanceSorting: function(a, b) {
		return a.distanceToUser - b.distanceToUser;
	},

	// helper to sort places by distance, descending
	sortByDistanceSortingDescending: function(a, b) {
		return b.distanceToUser - a.distanceToUser;
	},
    
    showLoadingPopup: function() {
        $("#popupLoading").popup("open");
    }
};

/* forward locationChanges to custom function */
//AR.context.onLocationChanged = World.locationChanged;