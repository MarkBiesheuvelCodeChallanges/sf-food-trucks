$(function () {

    var map;

    var cache = {};

    map = new google.maps.Map(document.getElementById('map'), {
        navigationControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        zoom: 16,
        minZoom: 15
    });

    /**
     * Draws a rectangle for area with latlng
     *
     * @param {Number} lat
     * @param {Number} lng
     */
    var drawDebugRectangle = function (lat, lng) {

        lat = Math.floor(lat * 100) / 100;
        lng = Math.floor(lng * 100) / 100;

        var rectangle = new google.maps.Rectangle({
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 0.35,
            map: map,
            bounds: {
                north: lat + 0.01,
                south: lat,
                east: lng + 0.01,
                west: lng
            }
        });
    };

    /**
     * Gets all the FoodTrucks with latitude equal to `Math.floor(lat * 100)` and longitude equal to `Math.floor(lng * 100)`
     *
     * @param {Number} lat
     * @param {Number} lng
     */
    var getFoodTrucks = function (lat, lng) {

        if (lat < 37.70 || lat > 37.82 || lng < -122.50 || lng > -122.37) {
            // Skip requests that are not even close to SF
            return;
        }

        var latlng = Math.floor(lat * 100) + ',' + Math.floor(lng * 100);

        if (latlng in cache) {
            // This area is already on the map
            return;
        }

        // Add to cache
        cache[latlng] = true;

        $.ajax({
            url: 'https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck',
            method: 'POST',
            data: JSON.stringify({latlng: latlng}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            crossDomain: true,
            error: function (a, b, c) {
                console.log(a, b, c);
            },
            success: function (responose) {

                // drawDebugRectangle(lat, lng);

                responose.forEach(function (row) {

                    new google.maps.Marker({
                        position: {
                            lat: row.latitude,
                            lng: row.longitude
                        },
                        map: map,
                        title: row.applicant
                    });
                });
            }
        });
    };


    /**
     * Load all the tiny rectangles within the current bounds
     */
    var idle = function () {

        var bounds = map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        var south = sw.lat();
        var north = ne.lat() + 0.01;
        var west = sw.lng();
        var east = ne.lng() + 0.01;

        // From south to north, from west to east
        for (var lat = south; lat < north; lat += 0.01) {
            for (var lng = west; lng < east; lng += 0.01) {
                getFoodTrucks(lat, lng);
            }
        }
    };

    google.maps.event.addListener(map, 'idle', idle);

});