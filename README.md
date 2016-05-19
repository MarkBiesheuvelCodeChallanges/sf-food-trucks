# San Francisco Food Trucks

A service that tells the user what types of food trucks might be found near a specific location on a map.

## Import data into Amazon DynamoDb

In order to be able to execute these commands you need to have a valid AWS access key and secret configured on your machine.
The user associated with these credentials also needs permissions to perform these actions.

To download the data file
```bash
wget https://data.sfgov.org/resource/6a9r-agq8.json -O import/food_trucks.json
```

To create DynamoDB table. (One time only)
```bash
node import/create-table.js
```

To import the complete dataset
```bash
node import/import.js
```

## Create API

Create Lambda function from `api/lambda.js` and add API Gateway to invoke Lambda function

## Host front-end

Upload content of `frontend` folder to S3

## Credits

[City and County of San Francisco](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat)

[jQuery](https://jquery.com/)

[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)


