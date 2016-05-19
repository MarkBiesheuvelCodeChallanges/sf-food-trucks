var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

let dynamodb = new AWS.DynamoDB();

let params = {
    TableName: "FoodTrucks",
    KeySchema: [
        {
            AttributeName: "latlng",
            KeyType: "HASH"
        },
        {
            AttributeName: "objectid",
            KeyType: "RANGE"
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: "latlng",
            AttributeType: "S"
        },
        {
            AttributeName: "objectid",
            AttributeType: "N"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 25,
        WriteCapacityUnits: 25
    }
};

dynamodb.createTable(params, (err) => {
    if (err) {
        throw err;
    }
});