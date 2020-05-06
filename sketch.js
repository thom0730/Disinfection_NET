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
let isFinishedLoading = false;

let world;

let margin = 80;
let offset = 100;
let tSize;
var startYpos = margin;
var endPoint = 13;
var speed = 1;
var lineSpacing = 1.4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont('monospace');
  tSize = 50*windowWidth/1440;
  world = createWorld();

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
        isFinishedLoading = true;
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
  background(255); // パターン1
  //background(248,246,249); // パターン1
  //background(28,29,24); // パターン1
  textSize(tSize);

  // We must always step through time!
  let timeStep = 1.0 / 20;
  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep, 10, 10);


  let drawPos = createVector(margin,startYpos);

  if (charObjects && isFinishedLoading) {
    push();
    translate (14, 14);
    rotate(PI/2);
    textSize(tSize*0.7);
    text('Disinfection.net', 0, 0);
    pop();

    for(let i = 0; i < charObjects.length; i++) {
      //culclate offset
      let offseti = offset + i*speed -(frameCount-startCount);
      if (offseti > offset) {
        break;
      }

      let charObject = charObjects[i];
      charObject.validatePhysics();
      charObject.setBasePosition(drawPos.x, drawPos.y);
      charObject.display();

      drawPos.x += textWidth(charObject.char);
      if(drawPos.x > width-margin) {
        let downYsize = tSize*lineSpacing;
        drawPos.x = margin;
        drawPos.y += downYsize;
        if (drawPos.y >= 2*windowHeight/3) {
          startYpos -= downYsize;
        }
      }
    }
  } else {
    let rectSize = 40;
    push();
    rectMode(CENTER);
    noFill();
    translate (windowWidth/2, windowHeight/2);
    stroke(colorBlack);
    rotate(frameCount * 0.03);
    rect(0, 0, rectSize, rectSize);
    rotate(frameCount * 0.1);
    rect(0, 0, rectSize, rectSize);
    rotate(frameCount * 0.05);
    rect(0, 0, rectSize, rectSize);

    pop();
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
        fill(colorWhite);
        noStroke();
        //rect(this.x, this.y-tSize, textWidth(this.char), tSize);
        pop();

        // 落ちるテキスト
        let pos = scaleToPixels(this.body.GetPosition());
        let a = this.body.GetAngleRadians();

        push();
        rotate(a);
        fill(colorBlack);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
