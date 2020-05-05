var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();
let useFont;

var covid19LocalizedName = [
  "コロナウィルス"
  // "コロナウィルス",
  // "Coronavirus",
  // "코로나바이러스감염증",
  // "коронавирусной инфекции",
  // "Penyakit koronavirus",
  // "neumonía por coronavirus",
  // "कोरोना वायरस रोग"
]

var results = [];

var combinedText = "";
let startCount;

let margin = 100;
let offset = 100;
let tSize = 20;

let oldWord = covid19LocalizedName[0];

function preload(){ useFont = loadFont('Nosifer'); }

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(25);
  textFont(useFont);

  codeBird.setConsumerKey(consumerKey, consumerSecret);
  codeBird.setToken(accessToken, accessTokenSecret);
  startCount = frameCount;

  for (let i=0; i<covid19LocalizedName.length; i++) {
    let params = {
      q: covid19LocalizedName[i],
      result_type: 'recent',
      count: 20
    };

    codeBird.__call('search_tweets', params, (result) => {
      for (let j=0; j<result.statuses.length; j++) {
        print(result.statuses[j].text);
        results.push(result.statuses[j].text);
        combinedText += result.statuses[j].text;
      }
    });
  }
}

function draw() {
  background(255);
  let drawPos = createVector(margin,margin);

  if (combinedText) {
    if (random(3) > 2.5) {
      let newWords = ['おいしいご飯　', 'サンマ　　　　', 'アイス　　　　'];
      let newWord = newWords[int(random(newWords.length))];
      combinedText = combinedText.replace(new RegExp(oldWord, 'g'), newWord);
      oldWord = newWord;
    }

    let charNums = unchar(split(combinedText,''));

    for(let i = 0; i < charNums.length; i++) {
  		//culclate offset
  		let offseti = offset + i*2 -(frameCount-startCount);
  		if (offseti > offset) {
        break;
  		} else if (offseti < 0) {
  			offseti = 0;
  			let n = noise((frameCount-startCount)/100,i);
  			if(n<0.2)offseti += n*100;
  		}
  		//char parameter
  		let col = '#000000';
  		// let ch = char(charNums[i] + offseti);
      let ch = char(charNums[i]);
  		//draw char
  		fill(col);
  		textSize(tSize);
  		text(ch,drawPos.x,drawPos.y);
  		drawPos.x += textWidth(char(charNums[i]));
  		if(drawPos.x > width-margin)
  		{
  			drawPos.x = margin;
  			drawPos.y += tSize*2;
  		}
  	}
  };
}
