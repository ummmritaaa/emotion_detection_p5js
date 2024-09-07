let faceapi;
let video;
let detections;
let emotions = ['neutral', 'happy', 'angry', 'sad', 'disgusted', 'surprised', 'fearful'];
let emotionValues = [0, 0, 0, 0, 0, 0, 0];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
  };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);
}

function modelReady() {
  console.log('Model Loaded!');
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;
  faceapi.detect(gotResults);
}

function draw() {
  image(video, 0, 0, width, height);
  if (detections) {
    if (detections.length > 0) {
      drawBox(detections);
      drawLandmarks(detections);
      drawExpressions(detections);
    }
  }
}

function drawBox(detections) {
  for(let i = 0; i < detections.length; i++) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight  = alignedRect._box._height;
    
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);
  }
}

function drawLandmarks(detections) {
  noFill();
  stroke(161, 95, 251);
  strokeWeight(2);

  for(let i = 0; i < detections.length; i++) {
    const mouth = detections[i].parts.mouth; 
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;

    drawPart(mouth, true);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEye, true);
    drawPart(rightEyeBrow, false);
  }
}

function drawPart(feature, closed) {
  beginShape();
  for(let i = 0; i < feature.length; i++) {
    const x = feature[i]._x;
    const y = feature[i]._y;
    vertex(x, y);
  }
  
  if(closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}

function drawExpressions(detections) {
  if(detections.length > 0) {
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    emotionValues = [neutral, happy, angry, sad, disgusted, surprised, fearful];
    
    textSize(14);
    noStroke();
    fill(0);

    text("neutral:       " + nf(neutral*100, 2, 2)+"%", 20, 20);
    text("happiness: " + nf(happy*100, 2, 2)+"%", 20, 40);
    text("anger:        " + nf(angry*100, 2, 2)+"%", 20, 60);
    text("sad:            " + nf(sad*100, 2, 2)+"%", 20, 80);
    text("disgusted:  " + nf(disgusted*100, 2, 2)+"%", 20, 100);
    text("surprised:  " + nf(surprised*100, 2, 2)+"%", 20, 120);
    text("fear:           " + nf(fearful*100, 2, 2)+"%", 20, 140);
    
    drawBarChart();
  }
}

function drawBarChart() {
  let barWidth = 30;
  let barSpacing = 10;
  let chartHeight = 100;
  let chartY = height - chartHeight - 10;
  
  for (let i = 0; i < emotions.length; i++) {
    let barHeight = emotionValues[i] * chartHeight;
    fill(161, 95, 251);
    rect(i * (barWidth + barSpacing) + 10, chartY + chartHeight - barHeight, barWidth, barHeight);
    
    fill(0);
    textSize(10);
    textAlign(CENTER);
    text(emotions[i], i * (barWidth + barSpacing) + 10 + barWidth/2, height - 5);
  }
}