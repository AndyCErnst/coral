const everyNthFrame = (n) => fCount % n === 0

// if a point intersects a square
function intersect({x,y}, sqX, sqY, width, height) {
    if(x > sqX && x < sqX+width && y > sqY && y < sqY+height) {
        return true
    }
    return false
}

function linearGradient(canvas, sX, sY, eX, eY, ...colors){
    let gradient = canvas.drawingContext.createLinearGradient(
        sX, sY, eX, eY
    );
    const increment = 1 / (colors.length - 1)
    colors.forEach((color, i) => gradient.addColorStop(increment * i, color))
    canvas.drawingContext.fillStyle = gradient;
}

// distance is a percentage
function groupedNoisyGradient(canvas, sX, sY, eX, eY, offColor, onColor, num, distance = 0.01){
    let gradient = canvas.drawingContext.createLinearGradient(
        sX, sY, eX, eY
    );
    num *= 2
    const increment = 1 / num
    for(var i = 0; i < num; i++) {
        const rand = map(noise(i + xoff/4), 0, 1, -0.05, 0.05)
        const n = increment * i + rand
        const stop1 = constrain(n, 0, 1)
        const stop2 = constrain(n + distance, 0, 1)
        if(i%2===0) {
            gradient.addColorStop(stop1, offColor);
            gradient.addColorStop(stop2 + distance, onColor);
        } else {
            gradient.addColorStop(stop1, onColor);
            gradient.addColorStop(stop2 + distance, offColor);
        }
    }
    canvas.drawingContext.fillStyle = gradient;
}

function noisyGradient(canvas, sX, sY, eX, eY, ...colors){
    let gradient = canvas.drawingContext.createLinearGradient(
        sX, sY, eX, eY
    );
    const increment = 1 / (colors.length - 1)
    colors.forEach((color, i) => {
        const n = map(noise(i + xoff/4), 0, 1, -0.06, 0.06)
        const stop = constrain(increment * i + n, 0, 1)
        gradient.addColorStop(stop, color);
    })
    canvas.drawingContext.fillStyle = gradient;
}

function radialGradient(canvas, sX, sY, radius, ...colors){
    let gradient = canvas.drawingContext.createRadialGradient(
      sX, sY, 0, sX, sY, radius
    );
    const increment = 1 / (colors.length - 1)
    colors.forEach((color, i) => gradient.addColorStop(increment * i, color))
    canvas.drawingContext.fillStyle = gradient;
}


// backup
  //function drawCoral() {
//   const coralPos = [[484,524],[500,492],[494,458],[454,444],[398,411],[391,297],[411,225],[424,250],[445,322],[443,363],[494,362],[509,301],[471,244],[473,192],[501,147],[554,165],[534,245],[541,282],[553,358],[579,357],[603,296],[600,192],[627,139],[674,136],[684,211],[662,280],[645,351],[647,366],[638,479],[585,486],[601,507],[560,527],[560,527]]
//   fill(255, 105, 180)
//   beginShape()
//   for(var i = 0; i < coralPos.length; i++) {
//     const [x2, y2] = coralPos[i]
//     vertex(x2, y2)
//   }
//   endShape()
// }