// Fish and light taken from https://editor.p5js.org/slow_izzm/sketches/YZtS2Rf_c, credit to slow_izzm
let fCount = 0 // current frame number, useful as a counter
const NUM_FISH = 11;
let xoff = 0; // increased every frame, used as noise offset
let debug = false
let mainCanvas
let coralLayer
let handX = 100;
let handY = 100;
let light;
let useMouse = true
let bleachMask
let sandLayer

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
    vertexes = []
  });
}

// get mouse or hand position
function getMousePos() {
  let xpos = useMouse ? mouseX : map(round(handX), -width * 0.25, width * 0.25, width, 0)
  let ypos = useMouse ? mouseY : map(round(handY), -height * 0.75, height, height, 0)
  return createVector(xpos, ypos)
}

function setup() {
  // pixelDensity(1) // uncomment if slow, lowers effective resolution
  mainCanvas = createCanvas(960, 540);
  noStroke()
  noCursor();
  light = new Light()
  initFish(NUM_FISH)
  createButtons()
  coralLayer = createGraphics(960, 540)
  drawCoral()
  genCoralGrid()
  sandLayer = createGraphics(960, 150)
  drawSand()
}

// light "source" hand indicator
function drawLight(pos) {
  light.render(pos)
}

function draw() {
  fCount++
  xoff += 0.01

  background(30, 13, 206);
  
  const mousePos = getMousePos()
  
  coralLayer.clear()
  // drawCoral()
  coralIntersection(mousePos)
  displayBleach()
  image(sandLayer, 0,480)
  image(coralLayer, 0, 0)
  
  drawFish(mousePos)
  drawLight(mousePos)
  drawLines()
  drawBubble()
  sunlight()
  
}