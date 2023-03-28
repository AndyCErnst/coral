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
    const cappedMov = constrain(movement-100, 0, 100)
    // this create the circles of the light
    for (let i = 0; i < 25; i += 8) {
      strokeWeight(6);
      fill(255, 255 - cappedMov, 255 - cappedMov, 83 - i);
      ellipse(0, 0, i);
    }

    pop();
    radialGradient(mainCanvas, x, y, 50, 
      color(255, 255-cappedMov, 255-cappedMov, 100), 
      color(255, 255-cappedMov, 255-cappedMov, 0))
    ellipse(x, y, 300)
  }

  render(pos) {
    return this.move(pos).display();
  }
}
