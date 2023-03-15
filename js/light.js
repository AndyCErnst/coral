class Light {
    constructor() {
      this.pos = createVector(random(width), random(height));
    }
  
    move(pos) {
      this.pos.set(pos.x, pos.y);
      return this;
    }
  
    display() {
      push();
      blendMode(ADD);
      translate(this.pos.x, this.pos.y);
      // this create the circles of the light
      for (let i = 0; i < 333; i += 13) {
        strokeWeight(6);
        stroke(111, 233, 233, 90 - i);
        fill(233 - i, 255, 255, 83 - i);
        ellipse(0, 0, i / 2);
      }
      pop();
  
      return this;
    }
  
    render(pos) {
      return this.move(pos).display();
    }
  }

  // drawingContext.shadowOffsetX = offsetX;
  // drawingContext.shadowOffsetY = offsetY;
  // drawingContext.shadowBlur = blurriness;
  // drawingContext.shadowColor = glowColor;

function drawBgLight() {
  // light effect. Draws all rectangles in bg at brightness relative to pointer
  // const rectSize = 33
  // for (let x = 0; x < width; x += rectSize) {
  //   for (let y = 0; y < height; y += rectSize) {
  //     let d = dist(light.pos.x, light.pos.y, x, y);
  //     noStroke();
  //     fill(map(d, 0, 255, 255, 0), map(d, 0, 255, 55, 0))
  //     rect(x, y, rectSize, rectSize);
  //   }
  // }

  // fill(11, 9, 33, 90);
  // rect(-4, -4, width + 4, height + 4);
}