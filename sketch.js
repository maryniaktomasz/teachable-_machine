let capture;

function setup() {
  createCanvas(1200, 600);
  capture = createCapture(VIDEO);
  capture.hide();
}

function draw() {
  rect(0, 0, width, height);
  translate(200, 0);
  scale(-1, 1);
  image(capture, 0, 0, 200, 200);
}
