
/* this is a dummy implementation to create poi-data, which are passed over to JS / Wikitude SDK on first location update */
function onLocationUpdated(tourJSON) {
//	var latitude = position.coords.latitude;
//	var longitude = position.coords.longitude;
//	var altitude = position.coords.altitude;
//	var placesAmount = 10;
//	var poiData = [];
//
//	// creates dummy poi-data around given lat/lon
//	for (var i=0; i< placesAmount; i++) {
//		poiData.push(
//            { 
//                'id': (i+1),
//                'longitude': longitude + 0.001 * ( 5 - getRandomInt(1,10) ),
//                'latitude' : latitude + 0.001 * (5 - getRandomInt(1,10)),
//                'description': 'This is the description of POI#'+(i+1),
//                'altitude' : 50.0,
//                'name': 'POI#'+(i+1)
//            }
//        );
//	}

	// inject POI data in JSON-format to JS
    if(!tourJSON) {
        var uhTourJSON = 
            [
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",


                      "coordinates": [
                          -95.34223299999996,
                          29.719949,
                          0
                      ]
                  },
                  "properties": {
                      "name": "University of Houston",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34193900000002,
                          29.721024,
                          0
                      ]
                  },
                  "properties": {
                      "name": "M.D. Anderson Library",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.345012,
                          29.719402,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Lynn Eusan Park",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.33939399999997,
                          29.720938000000004,
                          0
                      ]
                  },
                  "properties": {
                      "name": "C. T. Bauer College of Business",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.337939,
                          29.723856,
                          0
                      ]
                  },
                  "properties": {
                      "name": "University of Houston Law Center",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.338438,
                          29.72326,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Visitor Lot",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34249499999999,
                          29.724713,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Blaffer Art Museum",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34457600000002,
                          29.725162,
                          0
                      ]
                  },
                  "properties": {
                      "name": "The University of Houston-Moores School of Music",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.341251,
                          29.722885000000005,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Cullen College of Engineering",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34325999999999,
                          29.717923000000003,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Cougar Village",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34204899999997,
                          29.717054,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Moody Towers Residence Halls",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.33979799999997,
                          29.718646,
                          0
                      ]
                  },
                  "properties": {
                      "name": "University of Houston Welcome Center",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34143899999998,
                          29.718940000000003,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Hilton University of Houston",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.33921900000001,
                          29.716347,
                          0
                      ]
                  },
                  "properties": {
                      "name": "University Eye Institute",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.33844899999997,
                          29.717997,
                          0
                      ]
                  },
                  "properties": {
                      "name": "University of Houston-Campus Recreation Center",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.33655899999997,
                          29.718734,
                          0
                      ]
                  },
                  "properties": {
                      "name": "20C",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34727399999997,
                          29.725011000000002,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Hofheinz Pavilion",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34527700000001,
                          29.726847000000003,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Cougar Field",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              },
              {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [
                          -95.34886499999999,
                          29.726875,
                          0
                      ]
                  },
                  "properties": {
                      "name": "Cougar Softball Stadium",
                      "styleUrl": "#icon-503-DB4436",
                      "styleHash": "1027d25d"
                  }
              }
            ];
		var poiData = [];

		for (var i = 0; i < uhTourJSON.length; i++) {
			poiData.push({
				"id": (i + 1),
				"longitude": parseFloat(uhTourJSON[i].geometry.coordinates[0]),
				"latitude": parseFloat(uhTourJSON[i].geometry.coordinates[1]),
				"description": uhTourJSON[i].properties.name,
				"altitude": "50.0",
				"name": uhTourJSON[i].properties.name
			});
		}
        app.wikitudePlugin.callJavaScript("World.loadPoisFromJsonData(" + JSON.stringify(poiData) +");");
    } else {
		var poiData = [];
		for (var i = 0; i < tourJSON.length; i++) {
			poiData.push({
				"id": (i + 1),
				"longitude": parseFloat(tourJSON[i].location_long),
				"latitude": parseFloat(tourJSON[i].location_lat),
				"description": tourJSON[i].description,
				"altitude": "50.0",
				"name": tourJSON[i].title
			});
		}
        app.wikitudePlugin.callJavaScript("World.loadPoisFromJsonData(" + JSON.stringify(poiData) +");");
    }
}

function onLocationError(error) {
	alert("Not able to fetch location.");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
