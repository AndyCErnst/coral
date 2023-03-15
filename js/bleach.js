const bleachSize = 30
let bleaching = []

function drawBleach(pos) {
    coralLayer.fill(255, 255, 255)
    bleaching.forEach(b => {
        // remove this vastly improve performance, but can't erase old marks
        // coralLayer.ellipse(b.x, b.y, bleachSize, bleachSize)
    }) 
    if(mouseIsPressed && !drawing) {
        coralLayer.ellipse(pos.x, pos.y, bleachSize, bleachSize)
        bleaching.push(pos)
    }
}