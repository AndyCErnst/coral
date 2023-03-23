let branches = [];

function createAnemones() {
  for (let i = 0; i < 25; i++) {
    branches.push(new Branch());
  }
}

function drawAnemones() {
  stroke(0, 150, 255, 65)
  fill('#9b4dca');
  for (let i = 0; i < branches.length; i++) {
    let b = branches[i];
    push();
    translate(100, height-100);
    rotate(radians(b.startAngle));
    b.branch(b.segments);
    pop();
  }
}

class Branch {
  constructor() {
    this.segments = random(30, 100);
    this.startAngle = random(-90, 90);
    this.angle = map(this.startAngle, -90, 90, -10, 10);
    this.theta = 0;
    this.num = 0;
  }

  branch(len) {
    len *= 0.75;
    let t = map(len, 1, 70, 1, 10);
    this.theta = this.angle + sin(len + this.num) * 5;
    strokeWeight(t);
    line(0, 0, 0, -len);
    ellipse(0, 0, t, t);
    translate(0, -len);
    if (len > 5) {
      push();
      rotate(radians(-this.theta));
      this.branch(len);
      pop();
    } else {
      for (let i = 0; i < 360; i += 30) {
        let x = sin(radians(i)) * 10;
        let y = cos(radians(i)) * 10;
        line(0, 0, x, y);
      }
    }
    this.num += 0.003;
  }
}