var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

let documentClient = new AWS.DynamoDB.DocumentClient();

let insertItem = (row) => {

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

