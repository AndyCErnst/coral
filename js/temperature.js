let temp = 0
let totalBleaching = 0
const TEMP_INCREASE_RATE = 0.02
const TEMP_REDUCE_RATE = 0.005
const MAX_TEMP = 3

function handleTemperature(pos) {
  if (everyNthFrame(7)) {
    markTemperature(pos)
    bleachCoral(temp)
  }
  displayTemperature()
}

let xMovement = []
let yMovement = []
const pastStates = Array(10).fill(HEALTHY)
function markTemperature(pos) {
  if (xMovement.length >= 5) {
    xMovement.shift()
    yMovement.shift()
  }
  xMovement.push(pos.x)
  yMovement.push(pos.y)

  const totalMovement = mag(
    max(xMovement) - min(xMovement),
    max(yMovement) - min(yMovement)
  )
  if (totalMovement > 150) {
    const tempIncrease = (totalMovement / 300) * TEMP_INCREASE_RATE
    temp = min(MAX_TEMP, temp + tempIncrease)
    if (temp > 1.2) {
      addMessage(WARM)
    } else if (temp > 0.5) {
      addMessage(WARMING)
    }
  } else {
    temp = max(0, temp - TEMP_REDUCE_RATE)
    if (temp < 0.5) {
      addMessage(HEALTHY)
    } else if (temp < 2) {
      addMessage(HEALING)
    }
  }
}

function displayTemperature() {
  textSize(24)
  textAlign(LEFT)
  fill(255, 255, 255)
  text(`+${temp.toFixed(1)}°C`, 790, 54)

  thermometer()
}

function thermometer() {
  let thermoLen = 600
  const x = width / 2 - thermoLen / 2
  const y = 40

  noFill()
  stroke(255)
  rect(x, y, thermoLen, 12, 20)

  noStroke()
  fill(255)
  let redLen = map(temp, 0, MAX_TEMP, 6, thermoLen - 6)
  rect(3 + x, y + 3, redLen, 6, 20)
}
