let bg1
let floor
function initBackground() {
    bg1 = loadImage('images/bg1b-opt.png')
    floor = loadImage('images/floor-opt.png')
}
function displayBackground() {
  // 255, 255, 165 ugly green
  // healthy 125, 255, 255
  // unhealth 255, 255, 255
  if(deathTimer) {
    tint(255, 255, 255 - constrain(deathTimer, 0, 100))
  } else if (temp > 1) {
    tint(55 + temp*70, 255, 255)
  } else {
    tint(125, 255, 255)
  }
  image(bg1, 0, 0)
  image(floor, 0, height-floor.height)
  tint(255)
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

