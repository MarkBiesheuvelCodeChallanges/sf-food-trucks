var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

// This is a local copy of https://data.sfgov.org/api/views/rqzj-sfat/rows.json?accessType=DOWNLOAD
// TODO: Redownload on import
var dataset = require('./data/food_trucks.json');

// Create a mapping from column name to index number
var mapping = {};

dataset.meta.view.columns.forEach((column, i) => {

    // Store position of column (by name) (to zero-indexed)
    mapping[column.fieldName] = i;
});

const insertItem = (row) => {

    let objectid = parseInt(row[mapping.objectid], 10); // Integer

    let applicant = row[mapping.applicant]; // String
    let facilitytype = row[mapping.facilitytype]; // String
    let status = row[mapping.status]; // String

    let fooditems = row[mapping.fooditems].split(/\s*:\s*/); // List of strings

    let lat = parseFloat(row[mapping.latitude]); // Float
    let lng = parseFloat(row[mapping.longitude]); // Float

    let params = {
        TableName: "FoodTrucks",
        Item: {
            objectid,
            applicant,
            facilitytype,
            status,
            fooditems,
            coordinates: {lat, lng}
        }
    };

    docClient.put(params, function (err, data) {
        if (err) {
            throw err;
        }
    });

};

// Test on a four items for now
insertItem(dataset.data[0]);
insertItem(dataset.data[1]);
insertItem(dataset.data[2]);
insertItem(dataset.data[3]);
// dataset.data.forEach(insertItem);

