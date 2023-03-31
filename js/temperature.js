let temp = 0
let totalBleaching = 0
const TEMP_INCREASE_RATE = 0.02
const TEMP_REDUCE_RATE = 0.005
const MAX_TEMP = 3
let movement = 0

function handleTemperature(pos) {
  if (everyNthFrame(7)) {
    markTemperature(pos)
    bleachCoral(temp)
  }
  displayTemperature()
  displayCountdown()
}

let xMovement = [0, 0, 0, 0, 0]
let yMovement = [0, 0, 0, 0, 0]
const pastTemps = Array(10).fill(0)

function markTemperature(pos) {
  xMovement.shift()
  yMovement.shift()
  xMovement.push(pos.x)
  yMovement.push(pos.y)

  // averaging is intended to even out the movement
  // needs to be reexamined, it's probably not what we want
  movement = mag(
    max(xMovement) - min(xMovement),
    max(yMovement) - min(yMovement)
  )

  if (movement > 150) {
    const tempIncrease = (movement / 300) * TEMP_INCREASE_RATE
    temp = min(MAX_TEMP, temp + tempIncrease)
  } else {
    temp = max(0, temp - TEMP_REDUCE_RATE)
  }
  pastTemps.shift()
  pastTemps.push(temp)

  if (temp === MAX_TEMP && deathTimer === 0) {
    // DEAD
    addMessage(DYING)
    deathTimer = 1
    return
  }

  // dead state overrides everything so exit early
  if (deathTimer) {
    zRunning = false
    deathTimer++
    // ALGAE moves in
    if (deathTimer > 280) {
      restartEverything()
    } else if (deathTimer > 180) {
      addMessage(RESTART)
    } else if (deathTimer > 50) {
      addMessage(DEAD)
    }
    return
  }
  const avgTemp = pastTemps.reduce((t, a) => t + a) / pastTemps.length
  const warming = temp > avgTemp
  const cooling = Math.min(...pastTemps) === temp
  // only show the zooxanthelae in a certain temp range and warming
  if (warming && temp > 1.1 && temp < 2) {
    zRunning = true
  } else {
    zRunning = false
  }

  if (warming) {
    // WARMING
    if (temp > 1.2) {
      addMessage(WARM)
    } else if (temp > 0.5) {
      addMessage(WARMING)
    }
  } else if (temp < 0.5) {
    // COOL
    addMessage(HEALTHY)
  } else if (temp < 2 && cooling) {
    // COOLING
    addMessage(HEALING)
  }
}

function displayCountdown() {
  // give the message a 10 count head start
  if (deathTimer < 190) {
    return
  }
  push()
  ellipseMode(CENTER)
  noFill()
  stroke(255)
  strokeWeight(10)
  circle(width / 2, 200, 150)
  fill(255)
  noStroke()
  angleMode(DEGREES)
  const degrees = map(deathTimer, 190, 280, -90, 270)
  arc(width / 2, 200, 120, 120, -90, degrees, PIE)
  pop()
}

function displayTemperature() {
  push()
  setShadow()
  noStroke()
  textAlign(LEFT)
  fill(255, 255, 255)
  text(`+${temp.toFixed(1)}°C`, 790, 38)
  pop()
  thermometer()
}

function thermometer() {
  let thermoLen = 600
  const x = width / 2 - thermoLen / 2
  const y = 20

  fill(150)
  stroke(255)
  rect(x, y, thermoLen, 16, 20)

  noStroke()
  //255, 10, 27
  fill(240, map(temp, 0, MAX_TEMP, 240, 83), map(temp, 0, MAX_TEMP, 240, 64))
  let redLen = map(temp, 0, MAX_TEMP, 10, thermoLen - 6)
  rect(3 + x, y + 3, redLen, 10, 20)
}
