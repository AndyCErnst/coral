
const bleachingMax = 0.5
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
      color(`rgba(255, 255, 255, ${endOpac * 0.8})`),
      color(255, 255, 255, 0)
    )
    coralLayer.ellipse(x, y, bleachSize)
  })
  totalBleaching = (total / coralGrid.length).toFixed(2)
  temp = map(totalBleaching, 0, 0.5, 0, 2)
}


const BLEACH_RATE = 0.05
const RECOVER_RATE = 0.005
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
      } else if (section.b > 0) {
        section.b -= RECOVER_RATE
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
