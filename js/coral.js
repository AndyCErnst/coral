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
// [484, 524],
// [500, 492],
// [494, 458],
// [454, 444],
// [398, 411],
// [391, 297],
// [411, 225],
// [424, 250],
// [445, 322],
// [443, 363],
// [494, 362],
// [509, 301],
// [471, 244],
// [473, 192],
// [501, 147],
// [554, 165],
// [534, 245],
// [541, 282],
// [553, 358],
// [579, 357],
// [603, 296],
// [600, 192],
// [627, 139],
// [674, 136],
// [684, 211],
// [662, 280],
// [645, 351],
// [647, 366],
// [638, 479],
// [585, 486],
// [601, 507],
// [560, 527],
// [560, 527],
let coralGrid = []

const coralColors = ['#541388', '#D90368', '#BEE7B8', '#ebebeb', '#f45b69']
// work in progress
function coralPattern() {
  let cSpan = 400
  const { maxY, maxX, minY, minX } = coralBounds
  const counter = frameCount/cSpan
	let c1 = (int(counter)) % coralColors.length
	let c2 = (int(counter)+1) % coralColors.length
	let ratio = (counter - int(counter))
  coralLayer.push()
	coralLayer.translate((maxX+minX)/2,(maxY+minY)/2)
  coralLayer.fill(lerpColor(color(coralColors[c1]), color(coralColors[c2]), ratio ))
	for(var i=0;i<8;i++){
		coralLayer.rotate(frameCount/(40+10*log(frameCount))+i/10)
		let dd = frameCount/(30+i)+frameCount/5+sin(i)*150
		coralLayer.translate(random(dd/2,dd),0)
		
		let x = noise(frameCount/50 + i/50)*40 + random(50)
		let y = noise(frameCount/50 + i/50)*70 + random(50)
		
		let rr = random(4,12-log(frameCount)/10)
		coralLayer.ellipse(x,y,rr,rr)
	}
  coralLayer.pop()
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