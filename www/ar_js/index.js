/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    isDeviceSupported: false,
    
    isLoaded: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // check if the current device is able to launch ARchitect Worlds
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
        app.wikitudePlugin.isDeviceSupported(app.onDeviceSupportedCallback, app.onDeviceNotSupportedCallback);
    },
    onURLInvoked: function (url) {
       if (url.indexOf('closeWikitudePlugin') > -1) {
            app.wikitudePlugin.hide();
       } else if (url.indexOf('artInfo') > -1) {
            app.wikitudePlugin.hide();
            var id = url.substring(26);
            document.location = "#/tour/artDetail/" + id;
       } else if (url.indexOf('tourInfo') > -1) {
            app.wikitudePlugin.hide();
            var id = url.substring(27);
            if(id > 0)
                document.location = "#/tour/collage/" + id;
            else if (id == 0)
                document.location = "#/tour/";
            else if (id == -1)
                document.location = "#/tour/favorites";
       } else {
            alert('Unknown Command');
       }
    },
    // --- Wikitude Plugin ---
    // A callback which gets called if the device is able to launch ARchitect Worlds
    onDeviceSupportedCallback: function() {
        app.isDeviceSupported = true;
        app.wikitudePlugin.setOnUrlInvokeCallback(app.onURLInvoked);
    },

    // A callback which gets called if the device is not able to start ARchitect Worlds
    onDeviceNotSupportedCallback: function() {
        alert('AR is not supported on this device.');
    },
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(samplePath, tourJSON, tourName, tourID) {
        if (app.isDeviceSupported) {
            if(!app.isLoaded) {
                keepscreenon.enable();
                app.wikitudePlugin.loadARchitectWorld(samplePath);
                app.isLoaded = true;
            } else {
                app.wikitudePlugin.show();
            }
            if(tourJSON){
                onLocationUpdated(tourJSON);
            }
            if(tourName == "") {
                app.wikitudePlugin.callJavaScript("World.hideTour();");
            } else if(tourName) {
                app.wikitudePlugin.callJavaScript("World.showTour('" + tourName + "'," + tourID + ");");
            }
        } else {
            alert("Device is not supported");
        }
    }
};

app.initialize();
