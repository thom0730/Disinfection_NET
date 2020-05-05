// twitter api reference
// https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets.html

// const consumerKey = 'O4ULX60LivmMtUSxXeWcq6oMx';
// const consumerSecret = 'SgzOhc0Vh0TCH4i85wyDxzAfjaKEEzsO3noBmyf8F0SPSQH7Oy';

// const accessToken =	'862190010-dcaFHXRnb0u8u8wMf3J1h1wvwrCn56DqI0wMUNVe';
// const accessTokenSecret ='9Hq5hVNlaFz0DoLmu292JTiY8a3m8KOqKHeKPJAn7vBpV';


var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();

var params;

var results = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  codeBird.setConsumerKey(consumerKey, consumerSecret);
  codeBird.setToken(accessToken, accessTokenSecret);

  params = {
    q: 'コロナウィルス',
    result_type: 'recent',
    count: 5
  };
}

function draw() {
  background(255);
  text("aaaa", 100, 100);
  for (let i=0; i<results.length; i++) {
    text(results[i], 100, i*50+100);
  }

  codeBird.__call('search_tweets', params, (result) => {
    for (let i=0; i<result.statuses.length; i++) {
      print(result.statuses[i].text);
      results[i] = result.statuses[i].text
    }
  });
}
