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

    $.ajax({
        url: 'http://localhost/sf-food-trucks/import/data/food_trucks.json',
        dataType: 'json',
        success: function (data) {

            data.forEach(function (row) {

                if (!('location' in row) || row.location.type !== 'Point') {
                    return;
                }

                var marker = new google.maps.Marker({
                    position: {
                        lat: row.location.coordinates[1],
                        lng: row.location.coordinates[0]
                    },
                    map: map,
                    title: row.applicant
                })

            });
        }
    });

    var createRectangle = function (bool, lat, lng) {

        var color = bool ? '#000' : '#FFF';

        var bounds = {
            north: lat + 0.01,
            south: lat,
            east: lng + 0.01,
            west: lng
        };

        var rectangle = new google.maps.Rectangle({
            strokeColor: color,
            strokeOpacity: 0.8,
            fillColor: color,
            fillOpacity: 0.35,
            map: map,
            bounds: bounds
        });

        rectangle.addListener('click', function () {

            // TODO: request all markers within bounds
            console.log(Math.round(lat * 100)+ ',' + Math.round(lng * 100));

        });
    };

    var bool = true;

    for (var lat = 37.70; lat <= 37.8; lat += 0.01) {
        for (var lng = -122.50; lng <= -122.37; lng += 0.01) {

            createRectangle(bool, lat, lng);

            bool = !bool;
        }
    }

});