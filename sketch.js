"use strict";
let video;
let guess = "waiting...";
let classifier;
const modelURL = 'https://teachablemachine.withgoogle.com/models/45QO4nj80/';
let captureAspectRatio;
let current_image, img_working1, img_working2, img_hand_out;
let label = "background";
let battle_quest_active = false;
const tools = ["pigeon", "rabbit", "blue_pot", "book"];
const give_me_names = {
  "pigeon": "gołębia",
  "rabbit": "królika",
  "blue_pot": "roślinkę",
  "book": "książkę"
}
let quest_item

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  createCanvas(1200, 600);
  video = createCapture(VIDEO);
  video.hide();
  classifyVideo();
  captureAspectRatio = video.height / video.width;
  img_working1 = loadImage("images/working1.png");
  img_working2 = loadImage("images/working2.png");
  img_hand_out = loadImage("images/hand_out.png");

  current_image = img_working1;
  setInterval(imageChanger, 1000);

  setTimeout(battle_quest, random(3000, 7000)
  )
}
function classifyVideo() {
  classifier.classify(video, gotResults);
}
function draw() {
  background(0);
  image(current_image, 0, 0);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, 300, 300 * captureAspectRatio);
  pop();

  
  const confidenceThreshold = 0.9;
  if (guess.label == "pigeon" && guess.confidence > confidenceThreshold) {
    label = "pigeon";
  } else if (guess.label == "rabbit" && guess.confidence > confidenceThreshold) {
    label = "rabbit";
  } else if (guess.label == "blue_pot" && guess.confidence > confidenceThreshold) {
    label = "blue_pot";
  } else if (guess.label == "book" && guess.confidence > confidenceThreshold) {
    label = "book";
  } else if (guess.label == "background" && guess.confidence > confidenceThreshold) {
    label = "background";
  }

  if (battle_quest_active){
    textSize(30);
    text(label, width / 5, height / 4);
    text("podaj mnie no " + give_me_names[quest_item])
  }
  
}
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  guess = results[0];
  classifyVideo();
}

function imageChanger() {
  if (!battle_quest_active) {
    if (current_image == img_working1) {
      current_image = img_working2;
    } else {
      current_image = img_working1;
    }
  }
}

function battle_quest() {
  battle_quest_active = true;
  current_image = img_hand_out;
  quest_item = random(tools)
  console.log(quest_item)
  
}