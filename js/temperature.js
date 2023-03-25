
let temp = 0
let totalBleaching = 0
const TEMP_INCREASE_RATE = 0.02
const TEMP_REDUCE_RATE = 0.005
const MAX_TEMP = 3

function handleTemperature(pos) {
  if(everyNthFrame(5)){
    markTemperature(pos)
  }
  displayTemperature()
}

let xMovement = []
let yMovement = []
function markTemperature(pos) {
  if(xMovement.length >= 5) {
    xMovement.shift()
    yMovement.shift()
  }
  xMovement.push(pos.x)
  yMovement.push(pos.y)

  const totalMovement = mag(max(xMovement) - min(xMovement), max(yMovement) - min(yMovement))
  if(totalMovement > 150) {
    print('temp increasing')
    const tempIncrease = (totalMovement / 300) * TEMP_INCREASE_RATE
    temp = min(MAX_TEMP, temp + tempIncrease)
  } else {
    print('temp decreasing')
    temp = max(0, temp - TEMP_REDUCE_RATE)
  }
}

function displayTemperature() {
  textSize(32);
  textAlign(LEFT);
  fill(255, 255, 255);
  text(`+${temp.toFixed(1)}°C`, 0, 30);
}