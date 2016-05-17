var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

let dynamodb = new AWS.DynamoDB();

let params = {
    TableName: "FoodTrucks",
    KeySchema: [
        {
            AttributeName: "objectid",
            KeyType: "HASH"
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: "objectid",
            AttributeType: "S"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 4
    }
};

dynamodb.createTable(params, (err) => {
    if (err) {
        throw err;
    }
});