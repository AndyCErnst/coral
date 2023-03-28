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
const pastTemps = Array(10).fill(0)
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
  } else {
    temp = max(0, temp - TEMP_REDUCE_RATE)
  }
  pastTemps.shift()
  pastTemps.push(temp)
  const avgTemp = pastTemps.reduce((t, a) => t + a) / pastTemps.length

  if(temp === MAX_TEMP && deathTimer === 0) {
    // DEAD
    addMessage(DYING)
    deathTimer++
    return
  }

  if(deathTimer) {
    deathTimer++
    // ALGAE moves in
    if(deathTimer > 50) {
      addMessage(DEAD)
    } else if (deathTimer > 150) {
      addMessage(RESTART)
    } else if (deathTimer > 250) {
      restartEverything()
    }
    return
  }

  
  if (temp > avgTemp) {
    // WARMING
    if (temp > 1.2) {
      addMessage(WARM)
    } else if (temp > 0.5) {
      addMessage(WARMING)
    }
  } else if (temp < 0.5) {
    // COOL
    addMessage(HEALTHY)
  } else if (temp < 2 && Math.min(pastTemps) === temp) {
    // COOLING
    addMessage(HEALING)
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
