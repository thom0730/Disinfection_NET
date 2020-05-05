var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();
let useFont;

let covid19LocalizedName = [
  "コロナウィルス"
  // "コロナウィルス",
  // "Coronavirus",
  // "코로나바이러스감염증",
  // "коронавирусной инфекции",
  // "Penyakit koronavirus",
  // "neumonía por coronavirus",
  // "कोरोना वायरस रोग"
]

let filledKeywords = [
  "コロナ", "新型", "ウィルス", "ウイルス"
];

var results = [];

var combinedText = "";
var charObjectOfText = [];
let startCount;

let margin = 300;
let offset = 100;
let tSize = 40;
var startYpos = margin;

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
        addCharObjectOfText(resultText);
        results.push(result.statuses[j].text);

        combinedText += resultText;
      }
      checkFilledKeyword();
    });
  }
}

function draw() {
  background(248,246,249); // パターン1
  //background(28,29,24); // パターン1
  let drawPos = createVector(margin,startYpos);

  if (combinedText) {
    let charText = split(combinedText,'');

    for(let i = 0; i < charText.length; i++) {
  		//culclate offset
  		let offseti = offset + i*2 -(frameCount-startCount);
  		if (offseti > offset) {
        break;
  		}

  		//char parameter
      let col = '#000000'; //パターン1
      //let col = '#C0B3A2'; //パターン2
      let ch = charText[i];
      let charObject = charObjectOfText[i];
      if (charObject.isFilled) {
        rect(drawPos.x, drawPos.y-tSize, textWidth(charObject.char), tSize);
      }

  		//draw char
  		fill(col);
  		textSize(tSize);
  		text(ch,drawPos.x,drawPos.y);
  		drawPos.x += textWidth(charText[i]);
  		if(drawPos.x > width-margin) {
        let downYsize = tSize*1.5;
  			drawPos.x = margin;
  			drawPos.y += downYsize;
        if (drawPos.y >= windowHeight) {
          startYpos -= downYsize;
        }
  		}
  	}
  };
  print(charObjectOfText);
}

function addCharObjectOfText(sentence) {
  let charTextArray = split(sentence,'');
  for(let i = 0; i < charTextArray.length; i++) {
    let charObject = new CharObject();
    charObject.setChar(charTextArray[i]);
    charObjectOfText.push(charObject);
  }
}

function checkFilledKeyword() {
  for(let charObjectIndex = 0; charObjectIndex < charObjectOfText.length; charObjectIndex++) {
    for (let p = 0; p<filledKeywords.length; p++) {
      let filledKeywordCharArray = split(filledKeywords[p],'');

      //キーワードごとに該当する文字がキーワードと一致するか確認する
      for (let keywordIndex = 0; keywordIndex < filledKeywordCharArray.length; keywordIndex++) {
        if (charObjectOfText[charObjectIndex+keywordIndex].isFilled) { break; }

        if (filledKeywordCharArray[keywordIndex] != charObjectOfText[charObjectIndex+keywordIndex].char) {
          charObjectOfText[charObjectIndex+keywordIndex].setIsFilled(false);
          break;
        }

        if (filledKeywordCharArray[filledKeywordCharArray.length-1] == charObjectOfText[charObjectIndex+keywordIndex].char) {
          for (let z = 0; z <filledKeywordCharArray.length; z++) {
            charObjectOfText[charObjectIndex+z].setIsFilled(true);
          }
        }
      }
    }
  }
}

class CharObject {
  setChar(char){
    this.char = char;
  }

  setIsFilled(isFilled) {
    this.isFilled = isFilled;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
