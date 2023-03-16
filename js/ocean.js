function drawSurface() {
  fill('rgba(18, 218, 255, 0.5)')
  // fill('rgba(255, 255, 18, 0.5)')
  // We are going to draw a polygon out of the wave points
  beginShape()

  var localXoff = 0

  // Iterate over horizontal pixels
  for (var x = 0; x <= width + 15; x += 15) {
    // Calculate a y value according to noise, map to
    var y = map(noise(localXoff, xoff), 0, 1, -20, 80)

    // Set the vertex
    vertex(x, y)
    // Increment x dimension for noise
    localXoff += 0.02
  }
  vertex(width, 0)
  vertex(0, 0)
  endShape(CLOSE)
}

function sunlight() {
  push()
  blendMode(ADD)
  groupedNoisyGradient(
    mainCanvas,
    width,
    0,
    0,
    height / 2,
    color(252, 252, 63, 0),
    color(252, 252, 63, 30),
    6
  )
  rect(0, 0, width, height)
  pop()
}

// expensive, do only once
function drawSand() {
  sandLayer.noStroke()
  const colors = [
    color(225, 202, 170),
    color(235, 212, 180),
    color(250, 228, 204),
    color(255, 244, 224)
  ]
  sandLayer.loadPixels()
  const maxValleyDepth = 40
  const noiseLevel = 250
  for (let x = 0; x < sandLayer.width; x++) {
    const noiseDepth = maxValleyDepth * noise(x/noiseLevel)
    for (let y = 0; y < sandLayer.height; y++) {
      if(y + noiseDepth > maxValleyDepth) {
        sandLayer.set(x, y, random(colors))
      }
    }
  }
  sandLayer.updatePixels()
}
