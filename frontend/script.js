$(function () {

    var map;
    var markers = [];

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
     * Udate the map with new markers
     *
     * @param {Array} items
     */
    var updateMap = function (items) {
        // TODO: don't delete and recreate markers that are already on the map

        // Get rid of old markers
        markers.forEach(function (marker) {
            marker.setMap(null);
            delete marker;
        });

        // Create new markers
        markers = items.map(function (row) {
            return new google.maps.Marker({
                position: {
                    lat: row.latitude,
                    lng: row.longitude
                },
                map: map,
                title: row.applicant
            });
        });
    };

    /**
     * Gets all the FoodTrucks with a latitude between `north` and `south` and a longitude between `east` and `west`
     *
     * @param {Number} north
     * @param {Number} east
     * @param {Number} south
     * @param {Number} west
     */
    var getFoodTrucks = function (north, east, south, west) {

        var request = {
            bounds: {
                north: north,
                east: east,
                south: south,
                west: west
            }
        };

        request.name = '';
        request.food = 'mexican';
        request.open_on = 'mon';

        $.ajax({
            url: 'https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck',
            method: 'POST',
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: updateMap
        });
    };

    google.maps.event.addListener(map, 'idle', function () {

        var bounds = map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        getFoodTrucks(ne.lat(), ne.lng(), sw.lat(), sw.lng());
    });

});