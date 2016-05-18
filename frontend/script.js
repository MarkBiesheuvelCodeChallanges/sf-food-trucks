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
        scrollwheel: false,
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
        zoom: 15
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

    // Attempt to use extending bounds to determine which food trucks to load

    var convertBoundsToMinMax = function (bounds) {

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        return {
            lat: {
                min: sw.lat(),
                max: ne.lat()
            },
            lng: {
                min: sw.lng(),
                max: ne.lng()
            }
        };

    };

    google.maps.event.addListenerOnce(map, 'idle', function () {

        var previousBounds = null;

        var handleDrag = function(){
            var currentBounds = map.getBounds();

            var params = {
                include: convertBoundsToMinMax(currentBounds)
            };

            if (previousBounds) {

                params.exclude = convertBoundsToMinMax(previousBounds);

                // Expand accumulative bounds
                previousBounds = previousBounds.union(currentBounds);
            } else {
                previousBounds = currentBounds;
            }

            console.log(params);
        };

        // TODO: combine drag event with a throttled function
        google.maps.event.addListener(map, 'dragend', handleDrag);
        handleDrag();

    });


});