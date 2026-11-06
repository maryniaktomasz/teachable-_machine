// Note: when training in Teachable Machine, you need to disable "Flip Camera"
// for this feature to work

// put the model URL from https://teachablemachine.withgoogle.com/train/pose here
let poseModelURL = "https://teachablemachine.withgoogle.com/models/GMdTRytBp/";

let video;
let tmPoseModel;
let prediction = [];

async function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // this loads the custom model from Teachable Machine and schedules the
  // first prediction to be in 33ms
  tmPoseModel = await tmPose.load(poseModelURL + "model.json", poseModelURL + "metadata.json");
  console.log("Model loaded");
  setTimeout(predictTmPose, 33);
}

function draw() {
  image(video, 0, 0, width, height);

  if (prediction.length > 0) {
    fill(255, 0, 0);
    textSize(24);
    text(prediction[0].className + ' (' + prediction[0].probability + ')', 20, 20);
  }
}



// please ignore the details of this piece of code
// it runs the custom model, and updates the prediction
// variable with the result (we use the variable in draw)
async function predictTmPose() {
  try {
    let { pose, posenetOutput } = await tmPoseModel.estimatePose(video.elt);
    prediction = await tmPoseModel.predict(posenetOutput);
    // sort result by probability
    prediction = prediction.sort((a,b) => (a.probability < b.probability) ? 1 : ((b.probability < a.probability) ? -1 : 0))
  } catch (e) {
    console.warn(e);
  }
  //console.log(prediction);
  setTimeout(predictTmPose, 33);
}