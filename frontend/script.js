$(function () {

    var map;
    var markers = {};
    var filters = {};

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

        var previousMarkers = markers;
        markers = {};

        items.forEach(function (row) {

            if (row.objectid in previousMarkers) {

                // No need to recreate it
                markers[row.objectid] = previousMarkers[row.objectid];

                // Take it off the list of previous markers so it won't be deleted
                delete previousMarkers[row.objectid];

            } else {

                // Create new marker
                var marker = new google.maps.Marker({
                    position: {
                        lat: row.latitude,
                        lng: row.longitude
                    },
                    map: map,
                    title: row.applicant
                });

                markers[row.objectid] = marker;
            }
        });

        // Get rid of previous markers that weren't kept
        for (var objectid in previousMarkers) {
            previousMarkers[objectid].setMap(null);
        }
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

        var request = filters;

        request.bounds = {
            north: north,
            east: east,
            south: south,
            west: west
        };

        $.ajax({
            url: 'https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck',
            method: 'POST',
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if ('errorMessage' in response) {
                    console.error(response.errorMessage);
                } else {
                    updateMap(response);
                }
            }
        });
    };

    /**
     * Reload all the markers
     */
    var reload = function () {
        var bounds = map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        getFoodTrucks(ne.lat(), ne.lng(), sw.lat(), sw.lng());
    };


    $('[role="btn-group"]').each(function () {

        var $group = $(this);
        var name = $group.attr('name');
        var $buttons = $group.find('button');

        $buttons.each(function () {

            var $button = $(this);
            var value = $button.val();
            $button.on('click', function () {

                $buttons.removeClass('active');
                $button.addClass('active');

                filters[name] = value;

                reload();
            });
        });
    });

    $('[role="search"]').each(function () {

        var $search = $(this);
        var $input = $search.find('input');
        var $button = $search.find('button');
        var name = $input.attr('name');

        var update = function () {

            var value = $input.val();

            if (value === '') {
                delete filters[name];
            } else {
                filters[name] = value;
            }

            reload();
        };

        $input.on('keypress', function (e) {
            if (e.keyCode === 13) {
                update();
            }
        });

        $button.on('click', function () {
            update();
        });

    })

    google.maps.event.addListener(map, 'idle', reload);
});