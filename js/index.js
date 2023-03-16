// Fish and light taken from https://editor.p5js.org/slow_izzm/sketches/YZtS2Rf_c, credit to slow_izzm
let fCount = 0 // current frame number, useful as a counter
const NUM_FISH = 11;
let xoff = 0; // increased every frame, used as noise offset

let mainCanvas
let coralLayer
let handX = 100;
let handY = 100;
let light;
let useMouse = true
let bleachMask

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
  mainCanvas = createCanvas(960, 540);
  noStroke()
  noCursor();
  light = new Light()
  initFish(NUM_FISH)
  createButtons()
  coralLayer = createGraphics(width, height)
  drawCoral()
}

// get mouse or hand position
function getMousePos() {
  let xpos = useMouse ? mouseX : map(round(handX), -width * 0.25, width * 0.25, width, 0)
  let ypos = useMouse ? mouseY : map(round(handY), -height * 0.75, height, height, 0)
  return createVector(xpos, ypos)
}

// light "source" hand indicator
function drawLight(pos) {
  light.render(pos)
}

function drawCoral() {
  const coralPos = [[484,524],[500,492],[494,458],[454,444],[398,411],[391,297],[411,225],[424,250],[445,322],[443,363],[494,362],[509,301],[471,244],[473,192],[501,147],[554,165],[534,245],[541,282],[553,358],[579,357],[603,296],[600,192],[627,139],[674,136],[684,211],[662,280],[645,351],[647,366],[638,479],[585,486],[601,507],[560,527],[560,527]]
  coralLayer.fill(255, 105, 180)
  coralLayer.noStroke()
  coralLayer.beginShape()
  for(var i = 0; i < coralPos.length; i++) {
    const [x2, y2] = coralPos[i]
    vertex(x2, y2)
  }
  coralLayer.endShape()
  let ctx = coralLayer.canvas.getContext('2d')
  ctx.clip()
}


function draw() {
  fCount++
  xoff += 0.01

  background(30, 13, 206);
  drawOcean()

  const mousePos = getMousePos()
  
  drawBleach(mousePos)
  image(coralLayer, 0, 0)
  
  drawFish(mousePos)
  drawLight(mousePos)
  drawLines()
  drawBubble()
  sunlight()
}