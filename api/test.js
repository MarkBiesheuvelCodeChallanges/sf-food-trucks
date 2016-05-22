var lambda = require('./lambda.js');

exports.basicRequest = function (test) {

    lambda.handler({
        "bounds": {
            "north": 37.77914004014629,
            "east": -122.40716912689209,
            "south": 37.77065971667162,
            "west": -122.4316308731079
        }
    }, {
        succeed: function (response) {

            test.equal(response.length, 33, 'Thirtythree trucks in the area');
            test.ok(true, 'Received a valid response');
            test.done();
        },
        fail: function (err) {
            test.ok(false, 'Received an error');
            test.done();
        }
    });
};

exports.natansOnTuesDay = function (test) {

    lambda.handler({
        "bounds": {
            "north": 37.77914004014629,
            "east": -122.40716912689209,
            "south": 37.77065971667162,
            "west": -122.4316308731079
        },
        "name": "Natan's",
        "open_on": "tu"
    }, {
        succeed: function (response) {

            test.equal(response.length, 1, 'Only one food truck matches this request');
            test.equal(response[0].objectid, 783817, 'This is the food truck that should match');
            test.ok(true, 'Received a valid response');
            test.done();
        },
        fail: function (err) {
            test.ok(false, 'Received an error');
            test.done();
        }
    });
};

exports.invalid = function (test) {

    lambda.handler({
        "bounds": {
            "north": 37.77914004014629
        }
    }, {
        succeed: function (response) {
            test.ok(false, 'Received a response');
            test.done();
        },
        fail: function (err) {
            test.ok(true, 'Received an error');
            test.done();
        }
    });
};