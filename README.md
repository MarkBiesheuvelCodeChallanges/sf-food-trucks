# San Francisco Food Trucks

A service that tells the user what types of food trucks might be found near a specific location on a map.

## Goal

My goal for this code challenge is to try out and show two concepts: a serverless architecture and dynamic loading of geographical locations.

To accomplish this I have chosen to use the following set of microservices:
* [Amazon DynamoDB](https://aws.amazon.com/dynamodb): Store locations based on their coordinates to perform quick queries
* [AWS Lambda](https://aws.amazon.com/lambda/) & [Amazon API Gateway](https://aws.amazon.com/api-gateway/): Provide API to retrieve data
* [Amazon S3](https://aws.amazon.com/s3/) Host static front-end (hml/javascript)

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


