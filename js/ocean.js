function sunlight() {
  push()
  blendMode(ADD)
  groupedNoisyGradient(
    mainCanvas,
    width-100,
    100,
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
// function drawSand() {
//   sandLayer.noStroke()
//   const colors = [
//     color(225, 202, 170),
//     color(235, 212, 180),
//     color(250, 228, 204),
//     color(255, 244, 224)
//   ]
//   sandLayer.loadPixels()
//   const maxValleyDepth = 40
//   const noiseLevel = 250
//   for (let x = 0; x < sandLayer.width; x++) {
//     const noiseDepth = maxValleyDepth * noise(x/noiseLevel)
//     for (let y = 0; y < sandLayer.height; y++) {
//       if(y + noiseDepth > maxValleyDepth) {
//         sandLayer.set(x, y, random(colors))
//       }
//     }
//   }
//   sandLayer.updatePixels()
// }
