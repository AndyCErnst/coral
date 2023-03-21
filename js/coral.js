let coralPos = [
  [484, 524],
  [500, 492],
  [494, 458],
  [454, 444],
  [398, 411],
  [391, 297],
  [411, 225],
  [424, 250],
  [445, 322],
  [443, 363],
  [494, 362],
  [509, 301],
  [471, 244],
  [473, 192],
  [501, 147],
  [554, 165],
  [534, 245],
  [541, 282],
  [553, 358],
  [579, 357],
  [603, 296],
  [600, 192],
  [627, 139],
  [674, 136],
  [684, 211],
  [662, 280],
  [645, 351],
  [647, 366],
  [638, 479],
  [585, 486],
  [601, 507],
  [560, 527],
  [560, 527],
]
let coralGrid = []

// work in progress
function coralPattern() {
  // originalGraphics.drawingContext.shadowColor = str(random(colorset)) + "40";
  // originalGraphics.drawingContext.shadowOffsetX = 1;
  // originalGraphics.drawingContext.shadowOffsetY = 1;
  // originalGraphics.drawingContext.shadowBlur = 0;
  // coralLayer.drawingContext.filter = 'blur(8px)';
}

function drawCoral() {
  coralLayer.clear()
  coralLayer.drawingContext.fillStyle = 'rgb(255, 105, 180)'
  coralLayer.beginShape()
  // coralLayer.stroke(255,255,255)
  coralLayer.noStroke()
  for (var i = 0; i < coralPos.length; i++) {
    const [x2, y2] = coralPos[i]
    vertex(x2, y2)
  }
  coralLayer.endShape(CLOSE)
}
function clipMask() {
  let ctx = coralLayer.canvas.getContext('2d')
  ctx.clip() // this only needs to happen once
}

let totalBleaching = 0
const bleachSize = 200
const bleachThrottle = 0.3
// Display bleach radial gradients on coral layer
// based on level of bleaching of each section.
function displayBleach() {
  coralLayer.colorMode(RGB)
  let total = 0
  coralGrid.forEach(({ c, b }) => {
    const [x, y] = c
    const bleach = b * bleachSize
    total += b
    if (b < bleachThrottle) {
      return
    }
    const endOpac = b < 0.5 ? 0.4 : b
    radialGradient(
      coralLayer,
      x,
      y,
      bleach / 2,
      color(`rgba(255, 255, 255, ${endOpac})`),
      color(`rgba(255, 255, 255, ${endOpac*0.8})`),
      color(255, 255, 255, 0)
    )
    coralLayer.ellipse(x, y, bleachSize)
  })
  // print(total)
  // print(total / divisions^2)
  totalBleaching = (total / divisions**2).toFixed(2)
}

const BLEACH_RATE = 0.05
function coralIntersection(mousePos) {
  if (everyNthFrame(5) || debug) {
    coralGrid.forEach((section) => {
      const { x, y, w, h, c } = section

      if (intersect(mousePos, x, y, w, h)) {
        if (section.b < 1) {
          section.b += BLEACH_RATE
          print('section bleaching: ' + section.b)
        }
        if (debug) {
          fill(255 * section.b, 0, 255)
          rect(x, y, w, h)
        }
      }
      if (debug) {
        noFill()
        strokeWeight(2)
        stroke(255, 255, 200)
        rect(x, y, w, h)
        point(...c)
      }
    })
  }
}

/**
 *  The coral grid divides coral into `divisions` horizontal and vertical sections
 *  totaling `deivions`^2 areas. Each section has the following fields
 *  {
 * x: x starting coordinate
 * y: y starting coordinate
 * w: width
 * h: height
 * b: bleach amount (variable)
 * c: jittered center of the section, [x,y]
 * }
 *  */
const divisions = 5
function genCoralGrid() {
  print('generating coral grid')
  coralGrid = []
  const bounds = coralPos.reduce(
    (acc, [x, y]) => {
      if (x < acc.minX) {
        acc.minX = x
      }
      if (x > acc.maxX) {
        acc.maxX = x
      }
      if (y < acc.minY) {
        acc.minY = y
      }
      if (y > acc.maxY) {
        acc.maxY = y
      }
      return acc
    },
    {
      maxY: 0,
      maxX: 0,
      minY: Infinity,
      minX: Infinity,
    }
  )

  const { maxY, maxX, minY, minX } = bounds

  const xInc = (maxX - minX) / divisions
  const yInc = (maxY - minY) / divisions
  const jitter = xInc / 4
  strokeWeight(1)
  stroke(255, 255, 200)
  for (var horz = 0; horz < divisions; horz++) {
    for (var vert = 0; vert < divisions; vert++) {
      const x = minX + xInc * horz
      const y = minY + yInc * vert
      const w = xInc
      const h = yInc
      const c = [
        x + w / 2 + random(-jitter, jitter),
        y + h / 2 + random(-jitter, jitter),
      ]
      coralGrid.push({ x, y, w, h, b: 0, c })
    }
  }
}


let bleaching = []

// For manually bleaching (testing)
function drawBleach(pos) {
  coralLayer.fill(255, 255, 255, 100)
  bleaching.forEach((b) => {
    // remove to vastly improve performance,
    // but can't erase old marks
    // coralLayer.ellipse(b.x, b.y, bleachSize, bleachSize)
  })
  if (mouseIsPressed && !drawing) {
    radialGradient(
      coralLayer,
      pos.x,
      pos.y,
      bleachSize / 2,
      color(255, 255, 255, 100),
      color(255, 255, 255, 0)
    )
    coralLayer.ellipse(pos.x, pos.y, bleachSize)
    bleaching.push(pos)
  }
}