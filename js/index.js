// taken from https://editor.p5js.org/slow_izzm/sketches/YZtS2Rf_c, credit to slow_izzm

let fish = [];
const NUM_FISH = 11;
let xoff = 0;

let handX = 100;
let handY = 100;
let light;
let useMouse = true

Leap.loop(frame => {
  if (frame.hands.length > 0) {
    let hand = frame.hands[0];
    handX = hand.stabilizedPalmPosition[0];
    handY = hand.stabilizedPalmPosition[1];
    console.log(`handX ${handX}, hanxY ${handY}`)
  }
});

function createButtons() {
  // create buttons
  let totalButtonWidth = 0
  const buttonMargin = 10
  const motionButton = createButton('Switch to hands');
  totalButtonWidth += motionButton.size().width
  motionButton.position(width - totalButtonWidth, height);
  motionButton.mousePressed(() => {
    useMouse = !useMouse
    motionButton.html(useMouse ?  'Switch to hands' : "Switch to mouse")
  });
  const clearOilButton = createButton('Clear')
  totalButtonWidth += buttonMargin + clearOilButton.size().width
  clearOilButton.position(width - totalButtonWidth, height);
  clearOilButton.mousePressed(() => {
    clearOilButton.html('clear')
    setClearing()
    vertexes = []
  });
  const drawingButton = createButton('Draw shape')
  totalButtonWidth += buttonMargin + drawingButton.size().width
  drawingButton.position(width - totalButtonWidth, height);
  drawingButton.mousePressed(() => {
    drawing = true
  });
}

function setup() {
  createCanvas(960, 540);
  noCursor();
  light = new Light();
  for (var i = 0; i < NUM_FISH; i++) {
    fish.push(new Fish(random(width), random(height), random(0.3, 0.5)));
  }
  createButtons()
}

function getMousePos() {
  let xpos = useMouse ? mouseX : map(round(handX), -width * 0.25, width * 0.25, width, 0)
  let ypos = useMouse ? mouseY : map(round(handY), -height * 0.75, height, height, 0)
  return createVector(xpos, ypos)
}

// light "source" hand indicator
function drawLight() {
  light.render(getMousePos())
}

function drawFish() {
  const pos = getMousePos()
  for (let i = 0; i < fish.length; i++) {
    let x = map(noise(i + xoff), 0, 1, -0.1, 0.1);
    let y = map(noise(i + xoff + 1), 0, 1, -0.1, 0.1);

    fish[i].render(x, y, pos);
  }
  xoff += 0.01;
}

function draw() {
  background(40, 60, 180);
  const seaFloorY = height - 50;
  fill(194, 178, 128)
  rect(0, seaFloorY, width, height - seaFloorY)
  drawFish()
  drawLight();
  drawBgLight();
  drawLines();
  drawBubble();
}