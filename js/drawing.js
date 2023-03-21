let lastPoint
let vertexes = []
let drawing = false

function drawLines() {
    push()
    strokeWeight(2)
    stroke(255);
    fill(255)
    for(var i = 1; i < vertexes.length; i++) {
        const {x: x1, y: y1} = vertexes[i-1]
        const {x: x2, y: y2} = vertexes[i]
        line(x1, y1, x2, y2)
    }
    if(lastPoint && drawing) {
        line(lastPoint.x, lastPoint.y, mouseX, mouseY)
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
        lastPoint = vertex(mouseX, mouseY)
        vertexes.push(lastPoint)
    }
}

function doubleClicked() {
    print('Shape vertexes are ', vertexes)
    coralPos = vertexes
    drawCoral()
    clipMask()
    drawing = false
}