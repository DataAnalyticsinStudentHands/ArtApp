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
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        // check if the current device is able to launch ARchitect Worlds
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
        app.wikitudePlugin.isDeviceSupported(app.onDeviceSupportedCallback, app.onDeviceNotSupportedCallback);
    },
    onURLInvoked: function (url) {
       if ( 'closeWikitudePlugin' == url.substring(22) ) {
            app.wikitudePlugin.hide();
       } else if (url.indexOf('captureScreen') > -1) {
            app.wikitudePlugin.captureScreen(true, null, app.onScreenCaptured, app.onScreenCapturedError);
       } else if (url.indexOf('artInfo') > -1) {
            app.wikitudePlugin.hide();
            var id = url.substring(26);
            document.location = "#/tour/artDetail/" + id + "/AR/true";
       } else if (url.indexOf('tourInfo') > -1) {
            app.wikitudePlugin.hide();
            var id = url.substring(27);
            document.location = "#/tour/collage/" + id;
       } else {
            alert('ARchitect => PhoneGap ' + url);
       }
    },
    
    // called when the screen was captured successfully
    onScreenCaptured: function (absoluteFilePath) {
        alert("snapshot stored at:\n" + absoluteFilePath);
    },
    
    // called when the screen was captured successfully
    onScreenCapturedError: function (absoluteFilePath) {
        alert("Error with snapshot capture");
    },
    // This function extracts an url parameter
    getUrlParameterForKey: function(url, requestedParam) {
        requestedParam = requestedParam.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + requestedParam + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);

        if (results == null)
            return "";
        else {
            var result = decodeURIComponent(results[1]);
            return result;
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
        alert('Unable to launch ARchitect Worlds on this device');
    },
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(samplePath, tourJSON) {
        document.addEventListener("backbutton", onBackKeyDown, false);
        function onBackKeyDown() {
            app.wikitudePlugin.hide();
//            app.wikitudePlugin.close();
//            app.isLoaded = false;
            app.isLoaded = true;
            return false;
        }
        if (app.isDeviceSupported) {
            if(!app.isLoaded) {
                app.wikitudePlugin.loadARchitectWorld(samplePath);
                app.isLoaded = true;
                onLocationUpdated(tourJSON);
            } else {
                if(tourJSON){
                    app.wikitudePlugin.callJavaScript("World.showLoadingPopup();");
                    onLocationUpdated(tourJSON);
                }
                app.wikitudePlugin.show();
            }
            // inject poi data using phonegap's GeoLocation API and inject data using World.loadPoisFromJsonData
            //if ( "www/world/4_ObtainPoiData_1_FromApplicationModel/index.html" === samplePath ) {
            //    navigator.geolocation.getCurrentPosition(onLocationUpdated, onLocationError);
            //}
        } else {
            alert("Device is not supported");
        }
    }
};
app.initialize();
