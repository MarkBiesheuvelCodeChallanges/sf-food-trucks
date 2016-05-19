var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var documentClient = new AWS.DynamoDB.DocumentClient();

var insertItem = function (row) {

    if (!('latitude' in row) || !('longitude' in row)) {
        return
    }

    row.objectid = parseInt(row.objectid, 10);
    row.latitude = parseFloat(row.latitude);
    row.longitude = parseFloat(row.longitude);

    row.latlng = Math.floor(row.latitude * 100) + ',' + Math.floor(row.longitude * 100);

    var params = {
        TableName: "FoodTrucks",
        Item: row
    };

    // TODO: implement batchWriteItem http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property
    documentClient.put(params, function (err) {
        if (err) {
            throw err;
        }
    });
};

// This is a local copy of https://data.sfgov.org/resource/6a9r-agq8.json
var data = require('./food_trucks.json');

data.forEach(insertItem);

