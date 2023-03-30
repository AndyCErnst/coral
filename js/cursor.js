const lightSize = 100

class Light {
  constructor() {
    this.pos = createVector(-100, -100);
  }

  move(pos) {
    this.pos.set(pos.x, pos.y);
    return this;
  }

  display() {
    const { x, y } = this.pos
    push();
    blendMode(ADD);
    translate(x, y);
    // responsiveness is too slow unless we capture mouse movement 
    // more than every few frames
    // const cappedMov = constrain(movement-100, 0, 100)
    //       fill(255, 255 - cappedMov, 255 - cappedMov, 83 - i);
    // this create the circles of the light
    const cappedMov = 100
    for (let i = 20; i < 40; i += 8) {
      strokeWeight(6);
      fill(255, 255 - cappedMov, 255 - cappedMov, 83 - i);
      ellipse(0, 0, i);
    }

    pop();

    // radialGradient(mainCanvas, x, y, 50, 
    //   color(255, 255-cappedMov, 255-cappedMov, 100), 
    //   color(255, 255-cappedMov, 255-cappedMov, 0))
    // ellipse(x, y, 300)
  }

  render(pos) {
    return this.move(pos).display();
  }
}


let particles_smoke = []

function mouseMoved() {
  for (let i = 0; i < 4; i++) {
    let p = new Particle_Smoke(mousePos)
    particles_smoke.push(p)
  }
}

function drawPointerSmoke() {
  for (let i = particles_smoke.length - 1; i > -1; i--) {
    particles_smoke[i].display()
    particles_smoke[i].update()
    // remove dead smoke
    // this can be improved for performance
    if (particles_smoke[i].opacity <= 0) {
      particles_smoke.splice(i, 1)
    }
  }
}

class Particle_Smoke {
  constructor() {
    // physics
    this.x = mousePos.x
    this.y = mousePos.y
    this.xv = (Math.random()*2-1) * 0.8
    this.yv = (Math.random()*2-1) * 0.8
      // style
    this.r = 240
    this.g = 150
    this.b = 100
    this.opacity = 180
    this.radius = Math.random() * 10 + 0.6
    // this.gravity = 0.01
  }
  display() {
    noStroke()
    fill(this.r, this.g, this.b, this.opacity)
    ellipse(this.x, this.y, this.radius)
  }
  update() {
    // style
    this.opacity -= 4
    this.radius += 0.2
    // gravity
    // this.yv += this.gravity
    // movement
    this.x += this.xv
    this.y += this.yv
  }
}
