var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var documentClient = new AWS.DynamoDB.DocumentClient();

var getByLatLng = function (latlng, filters) {

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

    // if ('foodtype' in filters) {
    //     params.QueryFilter.foodtype = {
    //         ComparisonOperator: 'CONTAINS',
    //         AttributeValueList: [filters.foodtype]
    //     };
    // }

    if ('name' in filters) {

        params.QueryFilter.applicant = {
            ComparisonOperator: 'CONTAINS',
            AttributeValueList: [filters.name]
        };
    }
    
    if ('open_on' in filters) {
        params.QueryFilter.days = {
            ComparisonOperator: 'CONTAINS',
            AttributeValueList: [filters.open_on]
        };
    }
    
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

exports.handler = function (request, context) {

    var bounds = request.bounds;
    delete request.bounds;

    var north = Math.floor(bounds.north * 100);
    var east = Math.floor(bounds.east * 100);
    var south = Math.floor(bounds.south * 100);
    var west = Math.floor(bounds.west * 100);

    var promises = [];

    // From west to east and from south to north
    for (var lng = west; lng <= east; lng++) {
        for (var lat = south; lat <= north; lat++) {
            promises.push(getByLatLng(lat + ',' + lng, request));
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