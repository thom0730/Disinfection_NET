var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();

var covid19LocalizedName = [
  "コロナウィルス",
  "Coronavirus",
  "코로나바이러스감염증",
  "коронавирусной инфекции",
  "Penyakit koronavirus",
  "neumonía por coronavirus",
  "कोरोना वायरस रोग"
]

var results = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  codeBird.setConsumerKey(consumerKey, consumerSecret);
  codeBird.setToken(accessToken, accessTokenSecret);

  for (let i=0; i<covid19LocalizedName.length; i++) {
    let params = {
      q: covid19LocalizedName[i],
      result_type: 'recent',
      count: 10
    };

    codeBird.__call('search_tweets', params, (result) => {
      for (let j=0; j<result.statuses.length; j++) {
        print(result.statuses[j].text);
        results.push(result.statuses[j].text);
      }
    });
  }
}

function draw() {
  background(255);
  textSize(10);
  for (let i=0; i<results.length; i++) {
    text(results[i], 100, i*30+100);
  }
}
