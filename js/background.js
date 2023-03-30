let bg1
let bg2
let floor
function preloadBackground() {
  bg1 = loadImage('images/bg1b-opt.png')
  bg2 = loadImage('images/bg2-opt.png')
  floor = loadImage('images/floor-opt.png')
}
function displayBackground() {
  // healthy 125, 255, 255
  // unhealth 255, 255, 255
  // ugly green 255, 255, 165
  const t = deathTimer ? 3 : map(temp, 1, 3, 255, 0)
  image(bg2, 0, 0)
  tint(255, t)
  image(bg1, 0, 0)
  tint(255)
  image(floor, 0, height - floor.height)
}

// another way of displaying images is this. Not sure about the difference
// bg1 = createImg('images/bg1.png')
// bg1.position(50, 350)

// drawingContext.save(); // Save before clipping mask so you can undo it later on. ALWAYS DO THIS BEFORE TRANSLATIONS.
// strokeWeight(12);
// fill(color('rgb(255, 0, 0)'));
// circle(mouseX, mouseY, 200)
// drawingContext.clip();
// image(img,0,0,width,height);
// drawingContext.restore(); // Remove the clippping mask and go back to normal.
