let lastPoint
let vertexes = []
let drawing = false
let coralPos = [[484,524],[500,492],[494,458],[454,444],[398,411],[391,297],[411,225],[424,250],[445,322],[443,363],[494,362],[509,301],[471,244],[473,192],[501,147],[554,165],[534,245],[541,282],[553,358],[579,357],[603,296],[600,192],[627,139],[674,136],[684,211],[662,280],[645,351],[647,366],[638,479],[585,486],[601,507],[560,527],[560,527]]

function drawCoral() {
    coralLayer.clear()
    coralLayer.fill(255, 105, 180)
    coralLayer.noStroke()
    coralLayer.beginShape()
    for(var i = 0; i < coralPos.length; i++) {
      const [x2, y2] = coralPos[i]
      vertex(x2, y2)
    }
    coralLayer.endShape()
    let ctx = coralLayer.canvas.getContext('2d')
    ctx.clip()
}

function drawLines() {
    push()
    strokeWeight(2)
    stroke(255);
    fill(255)
    for(var i = 1; i < vertexes.length; i++) {
        const [x1, y1] = vertexes[i-1]
        const [x2, y2] = vertexes[i]
        line(x1, y1, x2, y2)
    }
    if(lastPoint && drawing) {
        line(lastPoint[0], lastPoint[1], mouseX, mouseY)
    }
    beginShape();
    for(var i = 0; i < vertexes.length; i++) {
        const [x2, y2] = vertexes[i]
        vertex(x2, y2)
    }
    if(lastPoint && drawing) {
        vertex(mouseX, mouseY)
    }
    endShape(CLOSE)
    pop()
}

function mouseClicked() {
    if(drawing && mouseX < width && mouseY < height) {
        lastPoint = [mouseX, mouseY]
        vertexes.push(lastPoint)
    }
}

function doubleClicked() {
    print('Shape vertexes are ', vertexes)
    coralPos = vertexes
    drawCoral()
    drawing = false
}