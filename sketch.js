var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();
let useFont;

var covid19LocalizedName = [
  "コロナ"
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
let tSize = 45;
var startYpos = margin;

let oldWord = covid19LocalizedName[0];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(25);
  textFont('monospace');

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
        let resultText = result.statuses[j].text
        resultText = resultText.replace(new RegExp('^RT ') ,'');
        resultText = resultText.replace(new RegExp('http.*') ,'');
        results.push(result.statuses[j].text);
        combinedText += resultText;
      }
    });
  }
}

function draw() {
  background(255);
  let drawPos = createVector(margin,startYpos);

  if (combinedText) {
    // if (random(3) > 2.5) {
    //   let newWords = ['おいしいご飯　', 'サンマ　　　　', 'アイス　　　　'];
    //   let newWord = newWords[int(random(newWords.length))];
    //   combinedText = combinedText.replace(new RegExp(oldWord, 'g'), newWord);
    //   oldWord = newWord;
    // }

    let charText = split(combinedText,'');

    for(let i = 0; i < charText.length; i++) {
  		//culclate offset
  		let offseti = offset + i*2 -(frameCount-startCount);
  		if (offseti > offset) {
        break;
  		}

  		//char parameter
  		let col = '#000000';
      let ch = charText[i];
      let rectWidth = 0.0;
      for (let j=0; j < covid19LocalizedName[0].length; j++) {
        let charTargetWord = split(covid19LocalizedName[0],'');
        if (charTargetWord[j] != charText[i+j]) {
          break;
        }
        rectWidth += textWidth(charText[i+j]);
        if (charTargetWord[charTargetWord.length-1] == charText[i+j]) {
          rect(drawPos.x, drawPos.y-tSize, rectWidth, tSize);
        }
      }
  		//draw char
  		fill(col);
  		textSize(tSize);
  		text(ch,drawPos.x,drawPos.y);
  		drawPos.x += textWidth(charText[i]);
  		if(drawPos.x > width-margin) {
        let downYsize = tSize*2;
  			drawPos.x = margin;
  			drawPos.y += downYsize;
        if (drawPos.y >= windowHeight) {
          startYpos -= downYsize;
        }
  		}
  	}
  };
}
