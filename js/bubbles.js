const bubbleRate = 200;
let bubbles = []; // array to hold bubble objects
let bubbleTimer = 0

function drawBubble() {
  // create new bubble every `bubbleRate` frames
  bubbleTimer--;
  if(bubbleTimer < 1) {
    bubbleTimer = bubbleRate
    const numBub = Math.floor(random(1,4))
    const randY = random(0, width)
    for(let i = 0; i < numBub; i++) {
      bubbles.push(new Bubble(randY + 8*i, height+30 + 20*i))
    }
    console.log('Framerate: ' +getFrameRate())
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
    this.color = color(200, 200, 255, 100); // color of the bubble
    this.rand = Math.floor(random(20,30)) // when to wobble
  }
  
  // Update the bubble's position
  update() {
    if(bubbleTimer % this.rand === 0){
      this.vel = createVector(-this.vel.x, this.vel.y)
    }
    this.pos.add(this.vel);
  }
  
  // Draw the bubble
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
  }
}
