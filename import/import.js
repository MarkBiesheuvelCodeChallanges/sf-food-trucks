var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

var documentClient = new AWS.DynamoDB.DocumentClient();

// var foodTypeRegexes = {
//     'mexican': /(burritos?|quesadillas?|tacos?|nachos?|mexican|enchiladas?)/i,
//     'sandwiches': /(sandwich(es)?|(ham)?burgers?)/i,
//     'snacks': /(snacks?|pretzels?|candy|cookies?|donuts?|chips|nuts?)/i,
//     'drinks': /(coffee|water|soda|juice|milk|beverages?|tea|hot chocolate|drinks?)/i
// };

var dayRegexes = {
    'mo': /mo/i,
    'tu': /(tu|mo-)/i,
    'we': /(we|(mo|tu)-(th|fr|sa|su))/i,
    'th': /(tu|(mo|tu|we)-(fr|sa|su))/i,
    'fr': /(fr|(mo|tu|we|th)-(sa|su))/i,
    'sa': /(sa|-su)/i,
    'su': /su/i
};

var insertItem = function (row) {

    if (!('latitude' in row) || !('longitude' in row)) {
        return
    }

    row.objectid = parseInt(row.objectid, 10);
    row.latitude = parseFloat(row.latitude);
    row.longitude = parseFloat(row.longitude);

    row.latlng = Math.floor(row.latitude * 100) + ',' + Math.floor(row.longitude * 100);

    // if ('fooditems' in row) {
    //     row.foodtype = [];
    //     for (var foodtype in foodTypeRegexes) {
    //         if (row.fooditems.match(foodTypeRegexes[foodtype])) {
    //             row.foodtype.push(foodtype);
    //         }
    //     }
    // }

    if('dayshours' in row){
        row.days = [];
        for (var day in dayRegexes) {
            if (row.dayshours.match(dayRegexes[day])) {
                row.days.push(day);
            }
        }
    }

    var params = {
        TableName: "FoodTrucks",
        Item: row
    };

    // TODO: implement batchWriteItem http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property
    documentClient.put(params, function (err) {
        if (err) {
            throw err;
        }
    });
};

// This is a local copy of https://data.sfgov.org/resource/6a9r-agq8.json
var data = require('./food_trucks.json');

data.forEach(insertItem);
