Public Art App
==========

The code is based on the Ionic Framework.

###Getting started:

1. Run `ionic serve`.
This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App.

2. `phonegap serve`
Works both in browser and with the Phone Gap developer app. Also updates when you make changes.

###Development Prerequisites:

bower `npm install -g bower`

gulp `npm install -g gulp`

npm packages `npm install`

###Running on a iOS/Android Device:

1. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`

2. Run `cordova platform add ios`

4. Run `cordova restore plugins ios --experimental`

5. Run `cordova plugin add <PACKAGE_NAME>` for the following plugins:

```
com.mediamatrixdoo.keepscreenon

org.apache.cordova.device

org.apache.cordova.file

org.apache.cordova.file-transfer

org.apache.cordova.geolocation

https://github.com/Wikitude/wikitude-phonegap.git
```

6. Edit `\plugins\com.wikitude.phonegap.WikitudePlugin\www\WikitudePlugin.js` and add the plugin key. A free trial key can be requested from Wikitude for development purposes.

6. Run `cordova platform build ios` or `cordova platform build android` and use appropriate cordova commands to test/build/deploy.
