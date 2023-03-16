const bleachSize = 60
let bleaching = []

function drawBleach(pos) {
    coralLayer.fill(255, 255, 255, 100)
    bleaching.forEach(b => {
        // remove to vastly improve performance, 
        // but can't erase old marks
        // coralLayer.ellipse(b.x, b.y, bleachSize, bleachSize)
    }) 
    if(mouseIsPressed && !drawing) {
        radialGradient(coralLayer, pos.x, pos.y, bleachSize/2, color(255, 255, 255, 100), color(255, 255, 255, 0))
        coralLayer.ellipse(pos.x, pos.y, bleachSize)
        bleaching.push(pos)
    }
}