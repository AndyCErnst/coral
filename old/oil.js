let oilDrops = []; // array to hold oil drop objects

const speed = 2;
let alpha = 240
let dColor
let clearing = false

class OilDrop {
  constructor(x, y) {
    this.pos = createVector(x, y); // position of the drop
    this.vel = createVector(random(-speed, speed), random(-speed, speed)); // velocity of the drop
    this.size = random(15, 45); // size of the drop
    dColor = color(20, 20, 20, alpha); // color of the drop
  }
  
  update() {
    this.pos.add(this.vel);
    
    // Apply friction to slow down the oil
    let friction = this.vel.copy();
    friction.normalize();
    friction.mult(-0.05);
    this.vel.add(friction);
  }
  
  // Draw the oil drop
  draw() {
    noStroke();
    fill(dColor);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function drawOil() {
    if(clearing) {
        clearOil()
    } else {
        if (mouseIsPressed) {
            oilDrops.push(new OilDrop(mouseX, mouseY));
            oilDrops.push(new OilDrop(mouseX, mouseY));
        }
    }

    for (let i = 0; i < oilDrops.length; i++) {
        oilDrops[i].update();
        oilDrops[i].draw();
    }
}

function setClearing() {
    clearing = true
}

function clearOil() {
    alpha -= 7
    if(alpha <= 0) {
        oilDrops = []
        alpha = 240
        clearing = false;
    } 
    dColor = color(20, 20, 20, alpha)
}