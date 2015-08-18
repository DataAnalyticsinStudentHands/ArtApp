Public Art App
==========
Mobile App to guide people through the public art collection at the campus of the University of Houston.

The code is using [Ionic Framework](http://ionicframework.com/) and [Wikitude SDK](http://www.wikitude.com/products/wikitude-sdk/) for Augmented Reality (AR) features.

##Development Prerequisites:

bower `npm install -g bower`



##Getting started for Development:

1. Run `npm install` Reads package.json and installs node packges into node_modules.

2. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`

2. Run `cordova platform add android@3.7.1` or `cordova platform add ios@3.8.0`

3. Set environment variable `ANDROID_BUILD` to `ant`.

4. Edit `\plugins\com.wikitude.phonegap.WikitudePlugin\www\WikitudePlugin.js` and add the plugin key. A free trial key can be requested from Wikitude for development purposes.

###Run in browser or Phonegap Developer App
 
7. Run `ionic serve`.
This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App.

###Running on a iOS/Android Device:
8. Run `cordova platform add ios` or `cordova platform add android`

6. Run `cordova platform build ios` or `cordova platform build android` and use appropriate cordova commands to test/build/deploy.
