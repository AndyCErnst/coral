let coralPos = [
  [361, 535],
  [325, 480],
  [367, 304],
  [417, 255],
  [459, 305],
  [503, 309],
  [537, 266],
  [550, 309],
  [581, 298],
  [617, 326],
  [648, 313],
  [657, 338],
  [709, 329],
  [746, 373],
  [803, 367],
  [816, 412],
  [811, 439],
  [854, 461],
  [877, 539],
  [877, 539],
]

let coralGrid = []


const coralDots = []
function coralPattern() {
  if(coralDots.length > 100) {
    coralDots.shift()
  }
  if(everyNthFrame(5)){
    coralDots.push(newDotPattern())
  }
  drawCoralPattern(coralDots)
}

const coralColors = ['#541388', '#d90368', '#bee7b8', '#ebebeb', '#f45b69']
function newDotPattern() {
  const cSpan = 400
  const { maxY, maxX, minY, minX } = coralBounds
  const counter = frameCount/cSpan
	let c1 = (int(counter)) % coralColors.length
	let c2 = (int(counter)+1) % coralColors.length
	let ratio = (counter - int(counter))
  const currColor = lerpColor(color(coralColors[c1]), color(coralColors[c2]), ratio)
  const dots = []
	for(var i=0; i < 10; i++){
		let x = random(minX, maxX)
		let y = random(minY, maxY)
		
		let size = random(3,10)
    dots.push([x,y,size])
	}
  return [currColor, dots]
}

function drawCoralPattern(coralDots) {
  coralDots.forEach(([currColor, dts]) => {
    coralLayer.fill(currColor)
    dts.forEach(dot => coralLayer.ellipse(...dot))
  })
}


function drawCoral() {
  coralLayer.clear()
  coralLayer.drawingContext.fillStyle = 'rgb(255, 105, 180)'
  coralLayer.beginShape()
  // coralLayer.stroke(255,255,255) // for debugging
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
let coralBounds = {maxY:0, maxX:0, minY:0, minX:0}
function genCoralGrid() {
  print('generating coral grid')
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
      color(`rgba(255, 255, 255, ${endOpac})`),
      color(`rgba(255, 255, 255, ${endOpac * 0.8})`),
      color(255, 255, 255, 0)
    )
    coralLayer.ellipse(x, y, bleachSize)
  })
}

function bleachCoral(temp) {
  const divisions = coralGrid.length
  coralGrid.forEach((section, i) => {
    section.b = map(temp, 0, MAX_TEMP, 0, (divisions - i)/divisions)
  })
}