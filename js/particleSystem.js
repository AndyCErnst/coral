let system

function setupZedPS() {
  const { maxY, maxX, minY, minX } = coralBounds
  system = new ParticleSystem(minX, minY, maxX-minX, maxY-minY)
}

let zRunning = false
function drawZedParticles() {
  if(zRunning) {
    system.addParticle()
  }
  system.run()
}

let varianceX = 0
let varianceY = 0
// A simple Particle class
let Particle = function (x, y, varX, varY) {
  this.velocity = createVector(Math.random() * 2 - 1, Math.random() - 2)
  this.position = createVector(
    x + Math.random() * varX,
    y + Math.random() * varY
  )
  this.lifespan = 400
}

Particle.prototype.run = function () {
  this.update()
  this.display()
}

Particle.prototype.update = function () {
  this.position.add(this.velocity)
  this.lifespan -= 3
}

// Method to display
Particle.prototype.display = function () {
  noStroke()
  fill(204, 43, 43, this.lifespan)
  ellipse(this.position.x, this.position.y, 8, 8)
}

Particle.prototype.isDead = function () {
  return this.lifespan < 0
}

// Particle system starts here
let ParticleSystem = function (x, y, varX, varY) {
  const num = 10
  this.x = x
  this.y = y
  this.varY = varY
  this.varX = varX
  this.particles = []
  this.deadParticles = Array(num)
    .fill(undefined)
    .map(() => new Particle(x, y))
}

ParticleSystem.prototype.addParticle = function () {
  this.particles.push(new Particle(this.x, this.y, this.varX, this.varY))
}

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i]
    p.run()
    if (p.isDead()) {
      this.particles.splice(i, 1)
    }
  }
}
