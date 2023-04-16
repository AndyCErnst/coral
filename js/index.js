let xoff = 0 // increased every frame, used as noise offset
let debug = false
let useMouse = true
let mainCanvas
let coralLayer
let oldMousePos = { x: 0, y: 0 }
let oldMousePos2 = { x: 0, y: 0 }
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
  if (!useMouse && frame.hands.length > 0) {
    let [hand1, hand2] = frame.hands
    // stabilizedPalmPosition doesn't seem to work on Windows
    const x = hand1.palmPosition?.[0] ?? 0
    const y = hand1.palmPosition?.[1] ?? 0
    const x2 = hand2?.palmPosition?.[0]
    const y2 = hand2?.palmPosition?.[1]
    // hands have odd range and behave irratically near the boundaries
    // need to `map` significantly inside these bounds to avoid "sticking"
    oldMousePos = mousePos
    mousePos = createVector(
      map(x, -200, 200, 0, width),
      map(y, 50, 550, height, 0)
    )
    oldMousePos2 = secondMousePos
    secondMousePos = createVector(
      x2 ? map(x2, -200, 200, 0, width) : undefined,
      y2 ? map(y2, 50, 550, height, 0) : undefined
    )
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
    drawingVerts = []
  })
  const drawingButton = createButton('Draw shape')
  totalButtonWidth += buttonMargin + drawingButton.size().width
  drawingButton.position(width - totalButtonWidth, height)
  drawingButton.mousePressed(() => {
    drawing = true
    drawingVerts = []
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
  textSize(28)
  textAlign(LEFT)
  pixelDensity(1) // uncomment if slow, lowers effective resolution
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
  // createButtons()
  coralLayer = createGraphics(960, 540)
  drawCoral()
  clipMask()
  genCoralGrid()
  createAnemones()
  setupZedPS() // must be after coral grid
  // if (!document.fullscreenElement) {
  //   document.documentElement.requestFullscreen();
  // } else if (document.exitFullscreen) {
  //   document.exitFullscreen();
  // }
}

// light "source" hand indicator
function drawCursor() {
  light1.render(mousePos)
  if (secondMousePos.x) {
    light2.render(secondMousePos)
  }
  drawPointerSmoke()
}

function draw() {
  xoff += 0.01
  background(226, 226, 255)
  // drawSurface()
  if (useMouse) {
    oldMousePos = mousePos
    mousePos = createVector(mouseX, mouseY)
  }
  if (oldMousePos.x !== mousePos.x) {
    createCursorEffect(mousePos)
  }
  if (oldMousePos2.x !== secondMousePos.x) {
    createCursorEffect(secondMousePos)
  }
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
  if (!useMouse) {
    // can't use `mouseMoved` listener for Leap motion so cursor effect is always on
    createCursorEffect(mousePos)
    secondMousePos.x ? createCursorEffect(secondMousePos) : undefined
  }
  drawCursor()
  sunlight()
  handleTemperature(mousePos)
  displayMessages()

  drawLines() // drawing mode only
  if (debug) {
    debugInfo()
  }
}

function mouseClicked() {
  console.log(mouseX, mouseY)
  drawingMouseClicked()
}

function doubleClicked() {
  drawingDoubleClick()
}

let fullscreen = false
function keyPressed() {
  if (keyCode === 68) {
    // letter d (for debug)
    useMouse = true
    debug = true
    createButtons()
  } else if (keyCode === 27) {
    // escape
    fullscreen = false
  } else if (!fullscreen) {
    // somehow only works once
    fullscreen = true
    mainCanvas.canvas.requestFullscreen()
  }
}
