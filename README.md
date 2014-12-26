Public Art App
==========

The code is based on the Ionic Framework.

###Getting started:

1. Run `ionic serve`.
This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App.

2. `phonegap serve`
Works both in browser and with the Phone Gap developer app. Also updates when you make changes.

###Running ARMode

The application must be running as a compiled APK/IPA in order to take advantage of the Wikitude Plugin that this project takes advantage of.

How to add the plugin:

1. Run `phonegap add plugin https://github.com/Wikitude/wikitude-phonegap.git`

2. Edit `\plugins\com.wikitude.phonegap.WikitudePlugin\www\WikitudePlugin.js` and add the plugin key. A free trial key can be requested from Wikitude for development purposes.

3. Add and build android/iOS application and run on device.


###Development Prerequisites:

bower `npm install -g bower`

gulp `npm install -g gulp`

npm packages `npm install`

###Starting Development:

1. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`
