let bubbles = []; // array to hold bubble objects

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let newBubble = new Bubble(mouseX, mouseY);
  bubbles.push(newBubble);

  // Draw bubbles
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].display();
  }
}

// Bubble object definition
class Bubble {
  constructor(x, y) {
    this.pos = createVector(x, y); // position of the bubble
    this.vel = createVector(random(-1, 1), random(-5, -1)); // velocity of the bubble
    this.radius = random(10, 30); // radius of the bubble
    this.color = color(200, 200, 255, 100); // color of the bubble
  }
  
  // Update the bubble's position
  update() {
    this.pos.add(this.vel);
    if(this.pos - this.radius < 0) {
        
    }
  }
  
  // Draw the bubble
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
  }
}
