# San Francisco Food Trucks

A service that tells the user what types of food trucks might be found near a specific location on a map.

## Setup the back-end

In order to be able to execute these commands you need to have a valid AWS access key and secret configured on your machine.
The user associated with these credentials also needs permissions to perform these actions.

To create DynamoDB table. (One time only)
```bash
node import/create-table.js
```

To import the complete dataset
```bash
node import/import.js
```

## Data source

https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat
