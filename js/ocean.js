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

function drawOcean() {
  drawSand()
  // drawSurface()
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
    color(252, 252, 63, 40),
    6
  )
  //252, 252, 63
  // if(fCount % 5 === 0 ){
  //  rect(0, 0, width, height)
  rect(0, 0, width, height)
  // }
  pop()
}

function drawSand() {
  linearGradient(
    mainCanvas,
    0,
    0, //Start point
    width,
    0, //End point
    color(255, 172, 9),
    color(182, 138, 0),
    color(255, 216, 0),
    color(255, 177, 35)
  )
  const seaFloorY = height - 50
  //   fill(194, 178, 128) // old version
  rect(0, seaFloorY, width, height - seaFloorY)
}
