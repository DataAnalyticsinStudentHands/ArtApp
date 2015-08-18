#!/usr/bin/env node
 
//this hook installs all your plugins
 
// add your plugins to this list--either 
// the identifier, the filesystem location 
// or the URL
var pluginlist = [
    "com.mediamatrixdoo.keepscreenon@1.0.1",
    "org.apache.cordova.device@0.2.13",
    "org.apache.cordova.file@1.3.2",
    "org.apache.cordova.file-transfer@0.4.8",
    "cordova-plugin-geolocation",
    "cordova-plugin-statusbar",
    "org.apache.cordova.inappbrowser@0.6.0",
    "https://github.com/Wikitude/wikitude-phonegap.git#699a81f"
];
 
// no need to configure below
 
var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
 
function puts(error, stdout, stderr) {
    sys.puts(stdout)
}
 
pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});