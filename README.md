Public Art App
==========
Mobile App to guide people through the public art collection at the campus of the University of Houston.

The code is using [Ionic Framework](http://ionicframework.com/) and [Wikitude SDK](http://www.wikitude.com/products/wikitude-sdk/) for Augmented Reality (AR) features.

##Development Prerequisites:

bower `npm install -g bower`

gulp `npm install -g gulp`

npm packages `npm install`

##Getting started for Development:

1. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`

2. Run `cordova restore plugins ios --experimental`

3. Run `cordova plugin add <PACKAGE_NAME>` for the following plugins
com.mediamatrixdoo.keepscreenon

org.apache.cordova.device

org.apache.cordova.file

org.apache.cordova.file-transfer

org.apache.cordova.geolocation

org.apache.cordova.statusbar

org.apache.cordova.inappbrowser

https://github.com/Wikitude/wikitude-phonegap.git

org.apache.cordova.inappbrowser

6. Edit `\plugins\com.wikitude.phonegap.WikitudePlugin\www\WikitudePlugin.js` and add the plugin key. A free trial key can be requested from Wikitude for development purposes.

###Run in browser or Phonegap Developer App
 
7. Run `ionic serve`.
This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App.

###Running on a iOS/Android Device:
8. Run `cordova platform add ios` or `cordova platform add android`

6. Run `cordova platform build ios` or `cordova platform build android` and use appropriate cordova commands to test/build/deploy.
