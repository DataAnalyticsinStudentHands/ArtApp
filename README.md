Public Art App
==========
Mobile App to guide people through the public art collection at the campus of the University of Houston.

The code is using [Ionic Framework](http://ionicframework.com/) and [Wikitude SDK](http://www.wikitude.com/products/wikitude-sdk/) for Augmented Reality (AR) features.

##Development Prerequisites:

bower `npm install -g bower`



##Getting started for Development:

1. Run `npm install` Reads package.json and installs node packges into node_modules.

2. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`

###Run in browser or Phonegap Developer App
 
7. Run `ionic serve`.
This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App. Wikitude will NOT function

###Running on a iOS/Android Device:
3. Set environment variable `ANDROID_BUILD` to `ant`.

4. Run `cordova platform add android@3.7.1` or `cordova platform add ios@3.8.0` Plugins are automatically installed via script in `hooks/before_platform_add`
NOTE: Please ignore warnings regarding outdated plugins. We are using fixed older versions of plugins to ensure that Wikitude functions properly.

5. Edit `\plugins\com.wikitude.phonegap.WikitudePlugin\www\WikitudePlugin.js` and add the plugin key. A free trial key can be requested from Wikitude for development purposes.

6. Run `ionic resources` to generate icons and splash screen assets.

7. Run `cordova platform build ios` or `cordova platform build android` and use appropriate cordova commands to test/build/deploy. NOTE: android-21 SDK Platform must be installed via SDKManager for a successful android build.
