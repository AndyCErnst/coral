let bg1
let floor
function initBackground() {
    bg1 = loadImage('images/bg1.png')
    floor = loadImage('images/floor.png')
}
function displayBackground() {
  image(bg1, 0, 0, width, height)
  image(floor, 0, height-floor.height, width)
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

  