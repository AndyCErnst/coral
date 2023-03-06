// taken from https://editor.p5js.org/slow_izzm/sketches/YZtS2Rf_c, credit to slow_izzm

let fish = [];
const NUM_FISH = 11;
let xoff = 0;

let handX = 100;
let handY = 100;
let light;

let button
let useMouse = true

Leap.loop(frame => {
  if (frame.hands.length > 0) {
    let hand = frame.hands[0];
    handX = hand.stabilizedPalmPosition[0];
    handY = hand.stabilizedPalmPosition[1];
    console.log(`handX ${handX}, hanxY ${handY}`)
  }
});

function setup() {
  createCanvas(960, 540);
  noCursor();
  light = new Light();
  for (var i = 0; i < NUM_FISH; i++) {
    fish[i] = new Fish(random(width), random(height), random(0.3, 0.5));
  }
  button = createButton('Switch to hands');
  button.position(width, height);
  button.mousePressed(() => {
    useMouse = !useMouse
    button.html(useMouse ?  'Switch to hands' : "Switch to mouse")
  });
}

function draw() {
  background(33);

  for (let i = 0; i < fish.length; i++) {

    let x = map(noise(i + xoff), 0, 1, -0.1, 0.1);
    let y = map(noise(i + xoff + 1), 0, 1, -0.1, 0.1);

    fish[i].render(x, y);
  }
  xoff += 0.01;

  let xpos = useMouse ? mouseX : map(round(handX), -width * 0.25, width * 0.25, width, 0)
  let ypos = useMouse ? mouseY : map(round(handY), -height * 0.75, height, height, 0)
  // light "source" hand indicator
  light.render(createVector(xpos, ypos))

  // light effect. Draws all rectangles in bg at brightness relative to pointer
  const rectSize = 33
  for (let x = 0; x < width; x += rectSize) {
    for (let y = 0; y < height; y += rectSize) {
      let d = dist(light.pos.x, light.pos.y, x, y);
      noStroke();
      fill(map(d, 0, 255, 255, 0), map(d, 0, 255, 55, 0))
      rect(x, y, rectSize, rectSize);
    }
  }

  fill(11, 9, 33, 90);
  rect(-4, -4, width + 4, height + 4);
}