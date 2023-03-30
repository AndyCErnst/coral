let xoff = 0 // increased every frame, used as noise offset
let debug = false
let useMouse = true
let mainCanvas
let coralLayer
let mousePos = { x: 0, y: 0 }
let secondMousePos = { x: 0, y: 0 }
let light1
let light2
let bleachMask
const NUM_FISH = 8

let rate = 0
const fps = []
function debugInfo() {
  if (everyNthFrame(10)) {
    if (fps.length >= 6) {
      fps.pop()
    }
    fps.push(getFrameRate())
    rate = Math.round(fps.reduce((f, a) => f + a, 0) / fps.length)
  }
  textSize(28)
  textAlign(LEFT)
  fill(255, 255, 255)
  text('fps: ' + rate, 30, 30)
}

Leap.loop((frame) => {
  if(useMouse) {
    mousePos.x = mouseX
    mousePos.y = mouseY
  } else if (frame.hands.length > 0) {
    let [hand1, hand2] = frame.hands
    const [x,y] = hand1.stabilizedPalmPosition
    const [x2, y2] = hand2?.stabilizedPalmPosition ?? []
    // hands have odd range and behave irratically near the boundaries
    // need to `map` significantly inside these bounds to avoid "sticking"
    mousePos.x = map(x, -280, 100, 0, width)
    mousePos.y = map(y, 50, 550, height, 0)
    secondMousePos.x = x2 ? map(x2, -280, 100, 0, width) : undefined
    secondMousePos.y = y2 ? map(y2, 50, 550, height, 0) : undefined
  }
})

function restartEverything() {
  temp = 0
  deathTimer = 0
  zRunning = false
}

function createButtons() {
  // create buttons
  let totalButtonWidth = 0
  const buttonMargin = 10
  const motionButton = createButton('Switch to hands')
  totalButtonWidth += motionButton.size().width
  motionButton.position(width - totalButtonWidth, height)
  motionButton.mousePressed(() => {
    useMouse = !useMouse
    motionButton.html(useMouse ? 'Switch to hands' : 'Switch to mouse')
  })
  const clearButton = createButton('Clear')
  totalButtonWidth += buttonMargin + clearButton.size().width
  clearButton.position(width - totalButtonWidth, height)
  clearButton.mousePressed(() => {
    clearButton.html('clear')
    coralGrid.forEach((seg) => (seg.b = 0))
    vertexes = []
  })
  const drawingButton = createButton('Draw shape')
  totalButtonWidth += buttonMargin + drawingButton.size().width
  drawingButton.position(width - totalButtonWidth, height)
  drawingButton.mousePressed(() => {
    drawing = true
    vertexes = []
  })
}

let algae
let algaeMask
let baseFont
function preload() {
  algae = loadImage('images/algae.png')
  algaeMask = loadImage('images/grad3.png')
  baseFont = loadFont('fonts/Poppins-Medium.ttf')
  preloadBackground()
  preloadWave()
}

function setup() {
  // pixelDensity(1) // uncomment if slow, lowers effective resolution
  mainCanvas = createCanvas(960, 540)
  textFont(baseFont)
  setupWave()
  algae.mask(algaeMask)
  noStroke()
  noCursor()
  light1 = new Light()
  light2 = new Light()
  initFish(NUM_FISH)
  // surfaceSetup()
  createButtons()
  coralLayer = createGraphics(960, 540)
  drawCoral()
  clipMask()
  genCoralGrid()
  createAnemones()
  setupZedPS() // must be after coral grid
}

// light "source" hand indicator
function drawCursor(pos) {
  light1.render(pos)
  if (secondMousePos.x) {
    light2.render(secondMousePos)
  }
  drawPointerSmoke()
}

// const ms = [5,6,6,6,6,6,6,6,6]
function draw() {
  // let start = millis()
  xoff += 0.01
  background(226, 226, 255)
  // drawSurface()

  // background
  displayBackground()
  drawAnemones()

  // foreground
  drawCoral()
  coralPattern(mousePos)
  displayBleach()
  drawAlgae()
  image(coralLayer, 0, 0)
  drawZedParticles()

  drawFish(mousePos)
  drawBubble()
  drawWave()

  // displays on top of simulation
  if(!useMouse) {
    // can't use `mouseMoved` listener for Leap motion so cursor effect is always on
    createCursorEffect(mousePos)
    secondMousePos.x ? createCursorEffect(secondMousePos) : undefined
  }
  drawCursor(mousePos)
  sunlight()
  handleTemperature(mousePos)
  displayMessages()

  drawLines() // drawing mode only
  debugInfo()
  // ms.shift()
  // ms.push(millis() - start)
  // if(everyNthFrame(10)){
  //   print('time ', ms.reduce((m,acc)=>m+acc)/ms.length)
  // }
}

function mouseClicked() {
  console.log(mouseX, mouseY)
}

function mouseMoved() {
  createCursorEffect(mousePos)
}
