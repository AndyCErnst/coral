let x, y; // position of the starfish
let size = 100; // size of the starfish
let speed = 2; // speed of the starfish
let seaFloorY; // y-coordinate of the sea floor

let limbAngles = []; // angles of the starfish's limbs
let limbSpeeds = []; // speeds of the starfish's limbs
let numLimbs = 20; // number of limbs
let limbLength = 80; // length of each limb
let limbThickness = 10; // thickness of each limb

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height - size / 2;
  seaFloorY = height - 50;
  
  // Set initial angles and speeds of the limbs
  for (let i = 0; i < numLimbs; i++) {
    limbAngles[i] = i * TWO_PI / numLimbs;
    limbSpeeds[i] = random(-0.05, 0.05);
  }
}

function draw() {
  background(220);
  
  // Draw sea floor
  fill(30, 140, 70);
  rect(0, seaFloorY, width, height - seaFloorY);
  
  // Draw starfish
  fill(255, 180, 40);
  noStroke();
  
  // Draw limbs
  for (let i = 0; i < numLimbs; i++) {
    let angle = limbAngles[i];
    let limbX = x + cos(angle) * size / 2;
    let limbY = y + sin(angle) * size / 2;
    let limbEndX = limbX + cos(angle) * limbLength;
    let limbEndY = limbY + sin(angle) * limbLength;
    stroke(255, 200, 100);
    strokeWeight(limbThickness);
    line(limbX, limbY, limbEndX, limbEndY);
    limbAngles[i] += limbSpeeds[i];
  }
  
  // Draw center of starfish
  noStroke();
  ellipse(x, y, size);
  
  // Move starfish
  x += speed;
  
  // Check if starfish hits right edge of canvas
  if (x + size / 2 > width) {
    x = width - size / 2;
    speed *= -1; // reverse direction
  }
  
  // Check if starfish hits left edge of canvas
  if (x - size / 2 < 0) {
    x = size / 2;
    speed *= -1; // reverse direction
  }
}
