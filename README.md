# San Francisco Food Trucks

A service that tells the user what types of food trucks might be found near a specific location on a map.

## Importer

This project uses a data set that's made available by the [City and County of San Francisco](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat).
This data is imported into a DynamoDB database with the following commands.

In order to be able to execute these commands you need to have a valid AWS access key and secret configured on your machine.
The user associated with these credentials also needs permissions to perform these actions.

To download the data file:
```bash
wget https://data.sfgov.org/resource/6a9r-agq8.json -O import/food_trucks.json
```

To create DynamoDB table: (One time only)
```bash
node import/create-table.js
```

To import the complete data set:
```bash
node import/import.js
```

## API

The API is available at [https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck](https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck)

### Usage

The API endpoint accepts `POST` request with a raw json body.

This json object is required to have a `bound` object with `north`, `east`, `south`, and `west` floats.
The API will return all food trucks within an area equal to or larger than given by these bounds.

With the `name` property you can filter on the name of the food truck

With the `open_on` property you can filter on which day the food truck will be open. Valid options are `mo`, `tu`, `we`, `th`, `fr`, `sa`, or `su`

With the `foodtype` property you can filter on the type of food the truck sells. Valid options are `snacks`, `mexican`, `sandwiches`, or `drinks`

### Example (jQuery)
```javascript
var request = {
  "bounds": { /* required */
      "north": 37.77914004014629, /* required */
      "east": -122.40716912689209, /* required */
      "south": 37.77065971667162, /* required */
      "west": -122.4316308731079 /* required */
  },
  "name": "Natan's", /* optional */
  "open_on": "tu" /* optional */
};

$.ajax({
    url: 'https://09ajp1m1wc.execute-api.eu-central-1.amazonaws.com/prod/FoodTruck',
    method: 'POST',
    data: JSON.stringify(request),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response) {
        if ('errorMessage' in response) {
            console.error(response.errorMessage);
        } else {
            response.forEach(function (item) {
                /* Do something with item */
            });
        }
    }
});
```

## Tests

To run the tests:
```bash
npm test
```

Right now the tests are based on a specific version of the data set so they might fail on newer versions.

## Code challenge

I created this project for a code challenge. 
The following paragraphs are about this code challenge.

### Track

The focus during this code challenge was on the back-end.

My familiarity with the technical stack is:
- **jQuery**: A lot of experience
- **Google Maps JavaScript API**: A lot of experience
- **Node.js** / **AWS Lambda**: A bit of experience
- **NoSQL databases** /  **DynamoDB**: No experience

### Technical choices, including architectural

My goal for this code challenge is to develop a serverless architecture.

To accomplish this I've chosen to use the following set of microservices:
- **[Amazon DynamoDB](https://aws.amazon.com/dynamodb)**: store locations based on their coordinates to perform quick queries
- **[AWS Lambda](https://aws.amazon.com/lambda/)** & **[Amazon API Gateway](https://aws.amazon.com/api-gateway/)**: provide API to retrieve data
- **[Amazon S3](https://aws.amazon.com/s3/)**: host static front-end (HTML/JavaScript)

However in hindsight I'm not sure whether DynamoDB was the right tool for the job or not.
In future projects I'll spend more time researching the possibilities and limitations of database engine to make a more informed decision.

One of the difficulties I tried to solve was loading the markers within specific bounds.
I wanted to avoid sending the whole data set when a user first loaded the map.
I made up a formula that maps a set of coordinates to buckets.
It does this by rounding the latitude and longitude to one hundredths of a degree.
These buckets correspond to the hash key of the DynamoDB database.

```javascript
var latlng = Math.floor(latitude * 100) + ',' + Math.floor(longitude * 100);
```

Another challenge was to extract useful information from the data set.
For example on which day a food truck is open.
In the data set this is a human-readable string such as `Mo-Fr`, `Mo/We/Fr`, or `We/Fr-Su`.
To check whether a food truck is open a given day I match this string against the following regexes:

```javascript
var dayRegexes = {
    'mo': /mo/i,
    'tu': /(tu|mo-)/i,
    'we': /(we|(mo|tu)-(th|fr|sa|su))/i,
    'th': /(tu|(mo|tu|we)-(fr|sa|su))/i,
    'fr': /(fr|(mo|tu|we|th)-(sa|su))/i,
    'sa': /(sa|-su)/i,
    'su': /su/i
};
```

### Live demo

- [http://sf-food-trucks.markbiesheuvel.nl/](http://sf-food-trucks.markbiesheuvel.nl/)

### Further improvements

- Reconsider database engine
- Add more filters
- Preload markers when dragging the map
- Use `batchWrite` when importing data (if still using DynamoDB)
- Minimize assets (HTML/JavaScript/CSS)
- Custom builds of jQuery/Bootstrap
- Make tests independent of data set
- Remove focus styling on buttons
- Add custom domain name for API Gateway and thereafter disable CORS.

### Resume/online profiles

- [Resume](https://markbiesheuvel.nl/)
- [LinkedIn](https://www.linkedin.com/in/markbiesheuvel)
- [GitHub](https://github.com/MarkBiesheuvel)

### Other code

- **My own website** ([code](https://github.com/MarkBiesheuvel/markbiesheuvel.nl)/[live](https://markbiesheuvel.nl/)): automated builds with tons of web performance optimazations
- **Six of spades** ([code](https://github.com/MarkBiesheuvel/six-of-spades)): a fully customizable poker library (in progress)

### Credits

- [jQuery](https://jquery.com/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)
- [Boostrap](http://getbootstrap.com/)