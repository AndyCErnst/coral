const bubbleRate = 200;
let bubbles = []; // array to hold bubble objects

// consider using sin wave https://editor.p5js.org/TimSherbert/sketches/L44ilSKSn
function drawBubble() {
  // create new bubble every `bubbleRate` frames

  if(frameCount % bubbleRate === 0) {
    const numBub = Math.floor(random(1,4))
    const randY = random(0, width)
    for(let i = 0; i < numBub; i++) {
      bubbles.push(new Bubble(randY + 8*i, height+30 + 20*i))
    }
    // remove bubbles off the top of screen
    bubbles = bubbles.filter(b => b.pos.y - 30 > 0)
  }

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
    this.vel = createVector(random(-0.5, 0.5), random(-1.5, -1)); // velocity of the bubble
    this.radius = random(5, 15); // radius of the bubble
    this.color = color(200, 200, 255, 40); // color of the bubble
    this.stroke = color(225,225,255, 80); // color of the shine
    this.rand = Math.floor(random(20,30)) // when to wobble
  }
  
  // Update the bubble's position
  update() {
    if(frameCount % this.rand === 0){
      this.vel = createVector(-this.vel.x, this.vel.y)
    }
    this.pos.add(this.vel);
  }
  
  // Draw the bubble
  display() {
    push()
    stroke(this.color)
    strokeWeight(1)
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2)
    stroke(this.stroke)
    strokeWeight(1.5)
    noFill()
    arc(this.pos.x, this.pos.y, this.radius*1.5, this.radius*1.5, 190, 260)
    pop()
  }
}

