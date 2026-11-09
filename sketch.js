"use strict";

const nothing = "backgroud";
const pigeon = "pigeon";
const rabbit = "rabbit";
const blue_pot = "blue_pot";
const book = "book";

let video;
let guess = "waiting...";
let classifier;
const modelURL = 'https://teachablemachine.withgoogle.com/models/45QO4nj80/';
let captureAspectRatio;
let current_image, img_working1, img_working2, img_hand_out, img_hand_pigeon, img_hand_rabbit, img_hand_blue_pot, img_hand_book, img_cursor, img_cursor_clicked;
let current_text;
let label = "background";
let battle_quest_active = false;
const tools = [pigeon, rabbit, blue_pot, book];
const responses = [...tools, nothing];
const give_me_names = {
  pigeon: "gołębia",
  rabbit: "królika",
  blue_pot: "roślinkę",
  book: "książkę"
};

const have_names = {
  pigeon: "gołąb",
  rabbit: "królik",
  blue_pot: "roślinka",
  book: "książka"
};
let image_for_item
let quest_item;
let current_cursor;
let sound;

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  // decrasing frame rate for lower CPU usage
  frameRate(30)
  // creating canvas and video capture
  createCanvas(1200, 600);
  video = createCapture(VIDEO);
  video.hide();
  classifyVideo();
  captureAspectRatio = video.height / video.width;

  // loading images and sound
  sound = loadSound("sounds/click_sound.mp3");
  img_working1 = loadImage("images/working1.png");
  img_working2 = loadImage("images/working2.png");
  img_hand_out = loadImage("images/hand_out.png");
  img_hand_pigeon = loadImage("images/hand_pigeon.png");
  img_hand_rabbit = loadImage("images/hand_rabbit.png");
  img_hand_blue_pot = loadImage("images/hand_blue_pot.png");
  img_hand_book = loadImage("images/hand_book.png");
  img_cursor = loadImage("images/cursor.png");
  img_cursor_clicked = loadImage("images/cursor_clicked.png");
  // mapping items to images for easier use later
  image_for_item = {
    pigeon: img_hand_pigeon,
    rabbit: img_hand_rabbit,
    blue_pot: img_hand_blue_pot,
    book: img_hand_book
  };

  // setting initial values for current image and cursor
  current_image = img_working1;
  current_cursor = img_cursor

  // ruuning repetable image changer and first battle quest after random time
  setInterval(imageChanger, 1000);
  setTimeout(battle_quest, random(3000, 7000))

}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  // removing cursor, fliped video, text and current image
  noCursor();
  background(0);
  image(current_image, 0, 0);
  text(current_text, 10, height / 4);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, 300, 300 * captureAspectRatio);
  pop();

  // setting confidence threshold for the guess and changing label if the guess is confident enough and is in the list of responses
  const confidenceThreshold = 0.90;
  if (guess.confidence > confidenceThreshold && responses.includes(guess.label)) {
    label = guess.label;
  }

  // checking if the battle quest is active and updating the current text based on the current quest stage
  if (battle_quest_active) {
    textSize(30);
    current_text = "Podaj mnie no " + give_me_names[quest_item] + ".";
    if (label == quest_item) {
      current_text = "Dziękuję!";
      battle_quest_active = false;
      given_item();
      setTimeout(clear_text, 2000);
      setTimeout(battle_quest, random(3000, 7000));
    } else if (label != nothing) {
      current_text = "Na kij mi " + have_names[label] + "!?";
      battle_quest_active = false;
      given_item();
      setTimeout(clear_text, 2000);
      setTimeout(battle_quest, random(3000, 7000));
    }
  }

  // drawing the current cursor at the mouse position
   image(current_cursor, mouseX, mouseY, 32, 32);
}

function gotResults(error, results) {
  // handling errors and updating the guess with the classification results
   if (error) {
    console.error(error);
    return;
  }
  guess = results[0];

  // calling classifyVideo (wich calls gotResults) after short delay for lower CPU usage
  setTimeout(classifyVideo, 300);
}


function imageChanger() {
  // switching between working images for animation effect
  if (!battle_quest_active) {
    if (current_image == img_working1) {
      current_image = img_working2;
    } else if (current_image == img_working2) {
      current_image = img_working1;
    }
  }
}

function battle_quest() {
  // starting a new battle quest, chosing target item and changing image
  battle_quest_active = true;
  current_image = img_hand_out;
  quest_item = random(tools)

}

function clear_text() {
  current_text = "";
}

function clear_image() {
  current_image = img_working1;
}

function clear_cursor() {
  current_cursor = img_cursor;
}

function given_item() {
  // changing the current image to the image for the given item and setting a timeout to clear it
  current_image = image_for_item[label];
  setTimeout(clear_image, 1500);
}

function mouseClicked() {
  // changing the current cursor to the clicked cursor image, playing a sound, and setting a timeout to clear the cursor
  current_cursor = img_cursor_clicked;
  sound.play();
  setTimeout(clear_cursor, 200);
}