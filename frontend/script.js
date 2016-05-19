$(function () {

    var map;

    var $window = $(window);
    var $el = $('#map');

    // Handle resizing of window
    var handleResize = function () {
        $el.css({
            width: $window.width(),
            height: $window.height(),
        });
    };
    $window.on('resize', handleResize);
    handleResize();

    map = new google.maps.Map($el[0], {
        // scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        zoomControl: false,
        streetViewControl: false,
        draggable: true,
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        zoom: 16
    });

    var createRectangle = function (lat, lng) {

        var bounds = {
            north: lat + 0.01,
            south: lat,
            east: lng + 0.01,
            west: lng
        };

        var rectangle = new google.maps.Rectangle({
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 0.35,
            map: map,
            bounds: bounds
        });

        rectangle.addListener('click', function () {

            // TODO: request all markers within bounds
            var latlng = Math.round(lat * 100) + ',' + Math.round(lng * 100);

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

                    rectangle.setMap(null);
                    delete rectangle;
                }
            });
        });
    };

    for (var lat = 37.70; lat <= 37.8; lat += 0.01) {
        for (var lng = -122.50; lng <= -122.37; lng += 0.01) {
            createRectangle(lat, lng);
        }
    }

});