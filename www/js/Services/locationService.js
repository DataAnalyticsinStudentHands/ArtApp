/*global angular, console, ionic, google, alert, intel */
/*jslint plusplus: true */

/* Location Services */
angular.module('Services').factory('accelerometerServe', function ($q) {
    'use strict';

    return {
        getCurrentAcceleration: function () {
            var q = $q.defer();

            navigator.accelerometer.getCurrentAcceleration(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            });

            return q.promise;
        },
        watchAcceleration: function (options) {
            var q = $q.defer(),
                watchID = navigator.accelerometer.watchAcceleration(function (result) {
                    // Do any magic you need
                    q.notify({
                        acc: result,
                        id: watchID
                    });
                }, function (err) {
                    q.reject(err);
                }, options);

            return q.promise;
        },
        clearWatch: function (watchID) {
            return navigator.accelerometer.clearWatch(watchID);
        }
    };
})

    .factory('compassServe', function ($q) {
        'use strict';
        return {
            getCurrentHeading: function () {
                var q = $q.defer();

                navigator.compass.getCurrentHeading(function (heading) {
                    q.resolve(heading);
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            },
            watchHeading: function (options) {
                var q = $q.defer(),
                    watchID = navigator.compass.watchHeading(function (result) {
                        q.notify({
                            head: result,
                            id: watchID
                        });
                    }, function (err) {
                        q.reject(err);
                    }, options);

                return q.promise;
            },
            clearWatch: function (watchID) {
                navigator.compass.clearWatch(watchID);
            }
        };
    })

    .factory('geolocationServe', function ($q) {
        'use strict';
        return {
            getCurrentPosition: function (options) {
                var q = $q.defer();

                navigator.geolocation.getCurrentPosition(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },
            watchPosition: function (options) {
                var q = $q.defer(),
                    watchID = navigator.geolocation.watchPosition(function (result) {
                        q.notify({
                            loc: result,
                            id: watchID
                        });
                    }, function (err) {
                        q.reject(err);
                    }, options);

                return q.promise;
            },
            clearWatch: function (watchID) {
                return navigator.geolocation.clearWatch(watchID);
            }
        };
    });