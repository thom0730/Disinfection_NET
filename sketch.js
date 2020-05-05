var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();

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

let coronaWord = [
  "コロナ", "新型", "ウィルス", "ウイルス"
];

var charObjects = [];
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
        addCharObject(resultText);
      }
      checkAllCoronaWords();
    });
  }
}

function draw() {
  background(248,246,249); // パターン1
  //background(28,29,24); // パターン1
  let drawPos = createVector(margin,startYpos);

  if (charObjects) {
    for(let i = 0; i < charObjects.length; i++) {
  		//culclate offset
  		let offseti = offset + i*2 -(frameCount-startCount);
  		if (offseti > offset) {
        break;
  		}

  		//char parameter
      let col = '#000000'; //パターン1
      //let col = '#C0B3A2'; //パターン2
      let charObject = charObjects[i];
      if (charObject.isCoronaWord) {
        rect(drawPos.x, drawPos.y-tSize, textWidth(charObject.char), tSize);
      }
      charObject.setBasePosition(drawPos.x, drawPos.y);

  		//draw char
  		fill(col);
  		textSize(tSize);
  		text(charObject.char,charObject.x,charObject.y);
  		drawPos.x += textWidth(charObject.char);
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
}

function addCharObject(sentence) {
  let charObjectsArray = split(sentence,'');
  for(let i = 0; i < charObjectsArray.length; i++) {
    let charObject = new CharObject();
    charObject.setChar(charObjectsArray[i]);
    charObjects.push(charObject);
  }
}

function checkAllCoronaWords() {
  // 1文字ずつみていく。
  for(let charObjectIndex = 0; charObjectIndex < charObjects.length; charObjectIndex++) {
    for (let p = 0; p<coronaWord.length; p++) {
      let coronaWordCharArray = split(coronaWord[p],'');

      // 該当する文字がキーワードと一致するか確認する
      for (let keywordIndex = 0; keywordIndex < coronaWordCharArray.length; keywordIndex++) {
        if (charObjects[charObjectIndex+keywordIndex].isCoronaWord) { break; }

        if (coronaWordCharArray[keywordIndex] != charObjects[charObjectIndex+keywordIndex].char) {
          charObjects[charObjectIndex+keywordIndex].setIsCoronaWord(false);
          break;
        }

        // 該当する文字からキーワードの文字数分後ろまで一致するか確認し、
        // 一致する場合、一致した文字全てにtrueを入れる
        if (coronaWordCharArray[coronaWordCharArray.length-1] == charObjects[charObjectIndex+keywordIndex].char) {
          for (let z = 0; z <coronaWordCharArray.length; z++) {
            charObjects[charObjectIndex+z].setIsCoronaWord(true);
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

  setIsCoronaWord(isCoronaWord) {
    this.isCoronaWord = isCoronaWord;
  }

  setBasePosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
