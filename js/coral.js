let coralPos = [
  [719,549],
  [338,512],
  [334,434],
  [345,314],
  [375,269],
  [414,298],
  [441,318],
  [470,298],
  [493,317],
  [512,310],
  [537,329],
  [563,320],
  [574,339],
  [608,336],
  [638,362],
  [680,363],
  [694,381],
  [692,409],
  [732,433],
  [733,474],
  [744,525]
]

let coralGrid = []

const coralDots = []
function coralPattern(mousePos) {
  if(deathTimer > 0) {
    return
  }
  if (coralDots.length > 100) {
    coralDots.shift()
  }
  if (everyNthFrame(3)) {
    coralDots.push(newDotPattern())
  }
  drawCoralPattern(coralDots, mousePos)
}

let coralColors = ['#bf1a41', '#ff662b', '#af0c0c', '#fe4500']
function newDotPattern() {
  const cSpan = 400
  const { maxY, maxX, minY, minX } = coralBounds
  const counter = frameCount / cSpan
  let c1 = int(counter) % coralColors.length
  let c2 = (int(counter) + 1) % coralColors.length
  let ratio = counter - int(counter)
  const currColor = lerpColor(
    color(coralColors[c1]),
    color(coralColors[c2]),
    ratio
  )
  const dots = []
  const numToAdd = map(temp, 0, MAX_TEMP - 1, 3, 0)
  for (var i = 0; i < numToAdd; i++) {
    const x = random(minX, maxX)
    const y = random(minY, maxY)
    const r = random(3, 10)
    dots.push([x, y, r])
  }
  return [currColor, dots]
}

// a bit expensive, keep optimization in mind
function drawCoralPattern(coralDots, mousePos) {
  const xAddAbs = (mousePos.x - width / 2) * 0.05
  const yAddAbs = (mousePos.y - height / 2) * 0.05
  for(let i = 0; i < coralDots.length; i++) {
    const [currColor, dts] = coralDots[i]
    coralLayer.fill(currColor)
    let xAddRel = xAddAbs * (i / coralDots.length) - 0.5
    let yAddRel = yAddAbs * (i / coralDots.length) - 0.5
    for(let j = 0; j < dts.length; j++) {
      const [x, y, r] = dts[j]
      coralLayer.circle(x + xAddRel, y + yAddRel, r)
    }
  }
}


function drawCoral() {
  coralLayer.clear()
  const colorAdd = (temp < 1 ? 1 : temp) * 25
  coralLayer.drawingContext.fillStyle = `rgb(245,${75+colorAdd},${65+colorAdd})`
  coralLayer.noStroke()
  coralLayer.beginShape()
  // coralLayer.stroke(245,245,245) // for debugging
  coralLayer.noStroke()
  for (var i = 0; i < coralPos.length; i++) {
    const [x, y] = coralPos[i]
    vertex(x, y)
  }
  coralLayer.endShape(CLOSE)
}

// Expensive, but only needs to happen after drawing a new coral shape.
function clipMask() {
  let ctx = coralLayer.canvas.getContext('2d')
  ctx.clip()
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
let coralBounds = { maxY: 0, maxX: 0, minY: 0, minX: 0 }
function genCoralGrid() {
  coralGrid = []
  // Find x,y,w,h of coral drawing
  coralBounds = coralPos.reduce(
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

  const { maxY, maxX, minY, minX } = coralBounds

  const xInc = (maxX - minX) / divisions
  const yInc = (maxY - minY) / divisions
  const jitter = xInc / 4
  const cg = coralPos.map(([x, y]) => createVector(x, y))

  // This reduces the size of the grid section checked,
  // removing the "slightly" overlapping rectangles
  // Shink is reduced from all sides of the rectangle
  const shrink = 15
  // create coral grid
  for (var horz = 0; horz < divisions; horz++) {
    for (var vert = 0; vert < divisions; vert++) {
      const x = minX + xInc * horz
      const y = minY + yInc * vert
      const w = xInc
      const h = yInc
      // each grid section has a center point pushed off center to look more natural
      const c = [
        x + w / 2 + random(-jitter, jitter),
        y + h / 2 + random(-jitter, jitter),
      ]
      // only add to grid if section overlaps with coral
      if (
        collideRectPoly(
          x + shrink,
          y + shrink,
          w - shrink * 2,
          h - shrink * 2,
          cg,
          true
        )
      ) {
        coralGrid.push({ x, y, w, h, b: 0, c })
      }
    }
  }
}

const bleachingMax = 0.5
const bleachSize = 200
// Display bleach radial gradients on coral layer
// based on level of bleaching of each section.
function displayBleach() {
  coralLayer.colorMode(RGB)
  coralGrid.forEach(({ c, b }) => {
    const [x, y] = c
    const bleach = b * bleachSize
    const endOpac = b < 0.5 ? 0.4 : b
    radialGradient(
      coralLayer,
      x,
      y,
      bleach / 2,
      color(`rgba(245, 245, 245, ${endOpac})`),
      color(`rgba(245, 245, 245, ${endOpac * 0.8})`),
      color(`rgba(225, 225, 225, 0)`)
    )
    coralLayer.circle(x, y, bleachSize)
  })
}

function bleachCoral(temp) {
  const divisions = coralGrid.length
  coralGrid.forEach((section, i) => {
    section.b = Math.max(0, map(temp, 1 + i / divisions, MAX_TEMP, 0, 1), deathTimer/50)
  })
}

function drawAlgae() {
  if(!deathTimer) {
    return
  }
  const { maxY, maxX, minY, minX } = coralBounds
  coralLayer.push()
  coralLayer.imageMode(CENTER)
  coralLayer.angleMode(DEGREES)
  const w = maxX - minX
  const h = maxY - minY
  coralLayer.translate(minX + w/2, minY + h/2)
  coralLayer.rotate(-35)
  coralLayer.image(algae, 0, Math.max(550 - 3.5 * deathTimer, 0), w+100, w+200)
  coralLayer.pop()
}