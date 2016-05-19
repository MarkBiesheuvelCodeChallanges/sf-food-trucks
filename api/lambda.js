var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context) {

    if (!('latlng' in event)) {
        context.fail('Invalid request');
        return;
    }

    var params = {
        TableName: 'FoodTrucks',
        AttributesToGet: ['applicant', 'fooditems', 'dayshours', 'latitude', 'longitude'],
        ConsistentRead: false,
        KeyConditions: {
            latlng: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [event.latlng]
            },
            objectid: {
                ComparisonOperator: 'GT',
                AttributeValueList: [0]
            }
        },
        QueryFilter: {
            status: {
                ComparisonOperator: 'EQ',
                AttributeValueList: ['APPROVED']
            }
        }
    };

    documentClient.query(params, function (err, data) {
        if (err) {
            context.fail(err.message);
        } else {
            context.succeed(data.Items);
        }
    });
};