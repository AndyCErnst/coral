let xoff = 0; // increased every frame, used as noise offset
let debug = false
let useMouse = true
let mainCanvas
let coralLayer
let handX1 = 100;
let handY1 = 100;
let handX2 = -100;
let handY2 = -100;
let light;
let bleachMask
let sandLayer
const NUM_FISH = 11;

let rate = 0
const fps = []
function debugInfo() {
  if(everyNthFrame(10)) {
    if(fps.length >= 6) {
      fps.pop()
    }
    fps.push(getFrameRate())
    rate = Math.round(fps.reduce((f,a) => f+a, 0) / fps.length)
  }
  textSize(32);
  textAlign(RIGHT)
  fill(255, 255, 255)
  text('avg fps: '+ rate, width-30, 30)
  text('total bleaching: ' + totalBleaching, width-30, 60)
}

function displayTemperature() {
  textSize(32);
  textAlign(LEFT);
  fill(255, 255, 255);
  text(`+${temp}°C`, 0, 30);
}

Leap.loop(frame => {
  if (frame.hands.length > 0) {
    let [hand1, hand2] = frame.hands
    handX1 = hand1.stabilizedPalmPosition[0]
    handY1 = hand1.stabilizedPalmPosition[1]
    if(hand2) {
      handX2 = hand2.stabilizedPalmPosition[0]
      handY2 = hand2.stabilizedPalmPosition[1]
    }
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
  const clearButton = createButton('Clear')
  totalButtonWidth += buttonMargin + clearButton.size().width
  clearButton.position(width - totalButtonWidth, height);
  clearButton.mousePressed(() => {
    clearButton.html('clear')
    coralGrid.forEach(seg => seg.b = 0)
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
  // hands have odd range and behave irratically near the boundaries
  // need to `map` significantly inside these bounds to avoid "sticking"
  // X Range -386.557 269.861
  // Y Range 75.7235  688.421
  let xpos = useMouse ? mouseX : map(handX1, -280, 100, 0, width)
  let ypos = useMouse ? mouseY : map(handY1, 50, 550, height, 0)
  return createVector(xpos, ypos)
}
let img
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
  clipMask()
  genCoralGrid()
  sandLayer = createGraphics(960, 150)
  drawSand()
  createAnemones()
  // img = createImg('anenome-test.gif')

}

// light "source" hand indicator
function drawLight(pos) {
  light.render(pos)
}
function draw() {
  xoff += 0.01

  background(30, 13, 206);
  image(sandLayer, 0,480)
  
  const mousePos = getMousePos()
  drawAnemones()
  
  drawCoral()
  coralPattern()
  displayBleach()
  image(coralLayer, 0, 0)
  
  drawFish(mousePos)
  drawLight(mousePos)
  drawLines()
  drawBubble()
  sunlight()
  // img.position(50, 350)

  displayTemperature()
  debugInfo()
}