var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

let documentClient = new AWS.DynamoDB.DocumentClient();

let insertItem = (row) => {

    if (!('latitude' in row) || !('longitude' in row)) {
        return
    }

    row.objectid = parseInt(row.objectid, 10);
    row.latitude = parseFloat(row.latitude);
    row.longitude = parseFloat(row.longitude);

    row.latlng = Math.floor(row.latitude * 100) + ',' + Math.floor(row.longitude * 100);

    let params = {
        TableName: "FoodTrucks",
        Item: row
    };

    // TODO: implement batchWriteItem http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property
    documentClient.put(params, (err) => {
        if (err) {
            throw err;
        }
    });
};

// This is a local copy of https://data.sfgov.org/resource/6a9r-agq8.json
// TODO: Download new file on import
const data = require('./data/food_trucks.json');

data.forEach(insertItem);

