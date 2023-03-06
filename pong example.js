
var barX = 50;
var barY = 200;

var xPos = 200;
var yPos = 200;
var xSpeed = 0;

var ballXspeed = 4;
var ballYspeed = 6;

var ballXpos = 300;
var ballYpos = 200;

function setup() {
  createCanvas(600, 400);
  background(0);
  rectMode(CORNER);
  ellipseMode(CENTER);
  fill(255);
}

function draw() {
  background(0);            // erase everything
  text("use your hand above the Leap Motion device",20,30);
  if(ballXpos>width){
     ballXspeed = -ballXspeed; 
  }
  if(ballYpos>height){
     ballYspeed = -ballYspeed; 
  }
  if(ballXpos<0){
     ballXspeed = -ballXspeed; 
  }
  if(ballYpos<0){
     ballYspeed = -ballYspeed; 
  }
  
  ballXpos += ballXspeed;
  ballYpos += ballYspeed;
  var check = testBorder();
  if (check == false){
    barX += xSpeed;
  }else{
    xSpeed = 0;
  }
  rect(barX, barY, 4,60);
  ellipse(ballXpos, ballYpos, 10, 10);
  hit = collideRectCircle(barX,barY,4,60,ballXpos,ballYpos,10);
  if(hit == true){
    ballXspeed = -ballXspeed;
  }
}


function testBorder(){
  var colission = false;
  if (barX > width-60 ){
      colission = true;
      barX = width-60;
  }
  if(barX < 0){
    colission = true;
      barX = 0;   
  }
  return colission;
}

//----------------------------------------------------


var hand, finger;
var positionX = 0;
var positionY = 0;
var grab;

var options = {enableGestures: true};
console.log("running…");

Leap.loop(options, function(frame){
	if (frame.hands.length  > 0){
	  for(var i = 0; i < frame.hands.length; i++){
		  var hand = frame.hands[i];
		  positionX = hand.palmPosition[0];					// output x-coordinate of hand
          positionY = hand.palmPosition[1];					// output y-coordinate of hand
		  grab = hand.grabStrength;
          //console.log("x: " +positionX);
          //console.log("spread: " +grab);
          //xSpeed += (positionX/500);
          //barX = positionX+(width/2);
          barY = -positionY+height;
	  }
	}  
});

