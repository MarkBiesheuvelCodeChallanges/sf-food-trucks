var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var documentClient = new AWS.DynamoDB.DocumentClient();

var getByLatLng = function (latlng) {

    var params = {
        TableName: 'FoodTrucks',
        AttributesToGet: ['applicant', 'fooditems', 'dayshours', 'latitude', 'longitude'],
        ConsistentRead: false,
        KeyConditions: {
            latlng: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [latlng]
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

    return new Promise(function (resolve, reject) {

        documentClient.query(params)
            .on('error', function (error) {
                reject(error.message);
            })
            .on('success', function (response) {
                resolve(response.data.Items);
            })
            .send();
    });
};

exports.handler = function (event, context) {

    var bounds = event.bounds;

    var north = Math.floor(bounds.north * 100);
    var east = Math.floor(bounds.east * 100);
    var south = Math.floor(bounds.south * 100);
    var west = Math.floor(bounds.west * 100);

    var promises = [];

    // From west to east and from south to north
    for (var lng = west; lng <= east; lng++) {
        for (var lat = south; lat <= north; lat++) {
            promises.push(getByLatLng(lat + ',' + lng));
        }
    }

    Promise.all(promises)
        .then(function (items) {

            // Flatten array
            items = Array.prototype.concat.apply([], items);

            context.succeed(items)
        })
        .catch(function (message) {
            context.fail(message);
        });
};