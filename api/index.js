// Simulate lambda event trigger

var lambda = require('./lambda.js');

// Sample event
var event = {
    latlng: '3780,-12243'
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