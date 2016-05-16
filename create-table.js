
var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "FoodTrucks",
    KeySchema: [
        { AttributeName: "objectid", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "objectid", AttributeType: "N" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 4
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});