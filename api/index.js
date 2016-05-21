// Simulate lambda event trigger

var lambda = require('./lambda.js');

// Sample event
var event = {
    "bounds": {
        "north": 37.77914004014629,
        "east": -122.40716912689209,
        "south": 37.77065971667162,
        "west": -122.4316308731079
    },
    "name": "Natan's",
    "open_on": "tu"
};

// Lambda-like context object
var context = {
    succeed: function (response) {
        console.log(response);
    },
    fail: function (err) {
        console.log({
            errorMessage: err
        });
    },
};

// Invoke lambda function
lambda.handler(event, context);