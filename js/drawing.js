let lastPoint
let drawingVerts = []
let drawing = false

function drawLines() {
    if(!drawing) {
        return
    }
    push()
    strokeWeight(2)
    stroke(255);
    fill(255)
    for(var i = 1; i < drawingVerts.length; i++) {
        const [x1, y1] = drawingVerts[i-1]
        const [x2, y2] = drawingVerts[i]
        line(x1, y1, x2, y2)
    }
    if(lastPoint) {
        line(lastPoint[0], lastPoint[1], mouseX, mouseY)
    }
    beginShape();
    for(var i = 0; i < drawingVerts.length; i++) {
        const [x2, y2] = drawingVerts[i]
        vertex(x2, y2)
    }
    if(lastPoint) {
        vertex(mouseX, mouseY)
    }
    endShape(CLOSE)
    pop()
}

function drawingMouseClicked() {
    if(drawing && mouseX < width && mouseY < height) {
        lastPoint = [mouseX, mouseY]
        drawingVerts.push(lastPoint)
    }
}

function drawingDoubleClick() {
    print('Shape drawingVerts are ', JSON.stringify(drawingVerts))
    coralPos = drawingVerts
    drawingVerts = []
    drawCoral()
    clipMask()
    drawing = false
}