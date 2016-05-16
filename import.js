
// This is a local copy of https://data.sfgov.org/api/views/rqzj-sfat/rows.json?accessType=DOWNLOAD
// TODO: Redownload on import
var dataset = require('./data/food_trucks.json');

// Create a mapping from column name to index number
var mapping = {};

dataset.meta.view.columns.forEach((column, i) => {

    // Store position of column (by name) (to zero-indexed)
    mapping[column.fieldName] = i;
});

dataset.data.forEach((row) => {

    // TODO: insert into database
    console.log(row[mapping.applicant]);
    console.log(row[mapping.facilitytype]);
    console.log(row[mapping.latitude]);
    console.log(row[mapping.longitude]);

});