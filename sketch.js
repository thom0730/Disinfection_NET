var consumerKey = 'gd1NIfRFADEMhRr9Yb5kPHojT';
var consumerSecret = 'zA9IjQOMdETsWDjO03vhnMV2N45Jstd64YWWRz8BcdZR9BiCA5';

var accessToken = '223004989-A3wvrZ3iGBTyceAceSQFUs9kFrM9pn16NIb6fAt9';
var accessTokenSecret = '3bJ2iOl1nk9edbHsSUdayqy2AnWCBJKbyhkNZE4fPHWhY';

const codeBird = new Codebird();

const colorWhite = '#FFFFFF';
const colorBlack = '#000000';

let covid19LocalizedName = [
  "コロナウィルス",
  "Coronavirus",
  "코로나바이러스감염증",
  "коронавирусной инфекции",
  "Penyakit koronavirus",
  "neumonía por coronavirus",
  "कोरोना वायरस रोग"
]

let coronaWord = [
  "コロナ", "新型", "ウィルス", "ウイルス",
  "COVID-19", "COVID19", "Covid19", "covid19",
  "corona", "virus", "Corona", "Virus",
  "korona",
  "SARS-CoV-2",
  "코로나바이러스감염증", "코로나19",
  "коронавирусной инфекции",
  "Penyakit koronavirus",
  "neumonía por coronavirus",
  "कोरोना वायरस रोग"
];

var charObjects = [];
let startCount;
let results = [];

let world;

let margin = 300;
let offset = 100;
let tSize = 40;
var startYpos = margin;

let bottomObject;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont('monospace');
  world = createWorld(new box2d.b2Vec2(0, 0));

  bottomObject = new BottomObject(0, windowHeight, windowWidth, 10);

  codeBird.setConsumerKey(consumerKey, consumerSecret);
  codeBird.setToken(accessToken, accessTokenSecret);
  startCount = frameCount;

  let isFinishedGettingResults = [];
  covid19LocalizedName.forEach((item, i) => {
    isFinishedGettingResults.push(false);
  });


  for (let i=0; i<covid19LocalizedName.length; i++) {
    let params = {
      q: covid19LocalizedName[i],
      result_type: 'recent',
      count: 100
    };

    codeBird.__call('search_tweets', params, (result) => {
      isFinishedGettingResults[i] = true;

      for (let j=0; j<result.statuses.length; j++) {
        print(result.statuses[j].text);
        let resultText = result.statuses[j].text
        resultText = resultText.replace(new RegExp('^RT +.*:') ,'');
        resultText = resultText.replace(new RegExp('http.*') ,'');
        results.push(resultText);
      }

      let isFinishedGettingAllResults = true;
      for (let k=0; k<isFinishedGettingResults.length; k++) {
        if (!isFinishedGettingResults[k]) {
          isFinishedGettingAllResults = false;
          break;
        }
      }

      if (isFinishedGettingAllResults) {
        shuffle(results, true);
        results.forEach((item, i) => {
          addCharObject(item);
        });
        checkAllCoronaWords();
      }
    });
  }
}

function draw() {
  background(248,246,249); // パターン1
  //background(28,29,24); // パターン1
  textSize(tSize);

  // We must always step through time!
  let timeStep = 1.0 / 20;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);
  bottomObject.display();


  let drawPos = createVector(margin,startYpos);

  if (charObjects) {
    for(let i = 0; i < charObjects.length; i++) {
  		//culclate offset
  		let offseti = offset + i*2 -(frameCount-startCount);
  		if (offseti > offset) {
        break;
  		}

      let charObject = charObjects[i];
      charObject.validatePhysics();
      charObject.setBasePosition(drawPos.x, drawPos.y);
      charObject.display();

  		drawPos.x += textWidth(charObject.char);
  		if(drawPos.x > width-margin) {
        let downYsize = tSize*1.5;
  			drawPos.x = margin;
  			drawPos.y += downYsize;
        if (drawPos.y >= windowHeight - tSize* 7) {
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

function validatePhysicsObject(charObject) {
  if (!charObject.checkedToNeedBody) {
    if ( 0.0 < charObject.x && charObject.x < windowWidth && 0.0 < charObject.y && charObject.y < windowHeight ) {
      charObject.setupBody();
    } else if (charObject.body) {
      world.DestroyBody(charObject.body);
    }
  }
}

class CharObject {
  setChar(char){
    this.char = char;
    this.checkedToNeedBody = false;
    this.isDisplay = false;
  }

  setIsCoronaWord(isCoronaWord) {
    this.isCoronaWord = isCoronaWord;
  }

  setBasePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  validatePhysics() {
    let insideDisplay = ( 0.0 < this.x && this.x < windowWidth && 0.0 < this.y && this.y < windowHeight );

    if (!this.checkedToNeedBody) {
      if (insideDisplay) {
        this.isDisplay = true;
        this.setupBody();
      } else if (this.body) {
        this.isDisplay = false;
        world.DestroyBody(this.body);
      }
    }

    if (!insideDisplay && this.body) {
      world.DestroyBody(this.body);
    }
  }

  setupBody() {
    if (this.isCoronaWord) {
      // Define a body
      let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(this.x, this.y);

      // Define a fixture
      let fd = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd.shape = new box2d.b2PolygonShape();
      fd.shape.SetAsBox(scaleToWorld(textWidth(this.char) / 2), scaleToWorld(tSize / 2));

      // Some physics
      fd.density = 1.0;
      fd.friction = 0.5;
      fd.restitution = 0.2;

      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd);
    }
    this.checkedToNeedBody = true;
  }

  display() {
    if (this.isDisplay) {
      if (this.isCoronaWord && this.body) {

        // 固定テキストの背景の黒塗り
        push();
        fill(colorBlack);
        rect(this.x, this.y-tSize, textWidth(this.char), tSize);
        pop();

        // 落ちるテキスト
        let pos = scaleToPixels(this.body.GetPosition());
        let a = this.body.GetAngleRadians();

        push();
        rotate(a);
        fill(colorBlack);
        rect(pos.x, pos.y-tSize, textWidth(this.char), tSize);
        fill(colorWhite);
        text(this.char, pos.x, pos.y);
        pop();
      } else {
        push();
        fill(colorBlack);
        text(this.char, this.x, this.y);
        pop();
      }
    }
  }
}


class BottomObject {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    let fd = new box2d.b2FixtureDef();
    fd.density = 1.0;
    fd.friction = 0.5;
    fd.restitution = 0.2;

    let bd = new box2d.b2BodyDef();

    bd.type = box2d.b2BodyType.b2_staticBody;
    bd.position.x = scaleToWorld(this.x);
    bd.position.y = scaleToWorld(this.y);
    fd.shape = new box2d.b2PolygonShape();
    fd.shape.SetAsBox(this.w / (scaleFactor * 2), this.h / (scaleFactor * 2));
    this.body = world.CreateBody(bd).CreateFixture(fd);
  }

  display() {
    push();
    fill(colorWhite);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}
