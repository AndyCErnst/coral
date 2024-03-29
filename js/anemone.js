// anemones are a simplified version of https://openprocessing.org/sketch/1876299
// The original one is prettier, but much less performant.
// These shrink and become transparent as temperature increases
// These are one of the slowest part of the simulation, so caution is needed.
//const positions = [[110, 420],[920, 400], [231, 503]]
const positions = [[110, 420],[920, 400]]
let anemones = [[], []];

function createAnemones() {
  for(let a = 0; a < anemones.length; a++) {
    for (let i = 0; i < 25; i++) {
      anemones[a].push(new Branch())
    }
  }
}

function drawAnemones() {
  stroke(3, 173, 37, 200 - 40*constrain(temp, 1, 3))
  angleMode(RADIANS)
  const t = deathTimer ? MAX_TEMP : temp
  const growthFactor = constrain(13 - 4 * t, 0, 10)
  for(let a = 0; a < anemones.length; a++) {
    for (let i = 0; i < anemones[a].length; i++) {
      push();
      let b = anemones[a][i];
      translate(positions[a][0], positions[a][1]);
      rotate(radians(b.startAngle));
      b.branch(b.segments, growthFactor);
      pop();
    }
  }
}

class Branch {
  constructor() {
    this.segments = random(5, 8);
    this.startAngle = random(-90, 90);
    this.angle = map(this.startAngle, -90, 90, -10, 10);
    this.theta = 0;
    this.num = 0;
  }

  branch(len, gf) {
    len *= 0.75;
    const growthFactor = len * gf
    this.theta = this.angle + Math.sin(len + this.num) * 5;
    strokeWeight(map(growthFactor/10, 0.1, 7, 1, 10))
    line(0, 0, 0, -growthFactor);
    // ellipse(0, 0, t, t);
    translate(0, -growthFactor);
    if (len > 2) {
      push();
      rotate(radians(-this.theta));
      this.branch(len, gf);
      pop();
    } else {
      // star at end of stalk
      for (let i = 0; i < 360; i += 40) {
        let x = Math.sin(radians(i)) * 10;
        let y = Math.cos(radians(i)) * 10;
        line(0, 0, x, y);
      }
    }
    this.num += 0.003;
  }
}

// ORIGINAL RECIPE

// const positions = [[130, 440],[890, 400], [231, 503]]
// let anemones = [[], [], []];

// function createAnemones() {
//   for(let a = 0; a < anemones.length; a++) {
//     for (let i = 0; i < 25; i++) {
//       anemones[a].push(new Branch())
//     }
//   }
// }

// // see https://openprocessing.org/sketch/1876299 for base code
// // The original one is prettier, but much less performant
// function drawAnemones() {
//   stroke(0, 150, 255, 65)
//   angleMode(RADIANS)
//   for(let a = 0; a < anemones.length; a++) {
//     for (let i = 0; i < anemones[a].length; i++) {
//       push();
//       let b = anemones[a][i];
//       translate(positions[a][0], positions[a][1]);
//       rotate(radians(b.startAngle));
//       b.branch(b.segments);
//       pop();
//     }
//   }
// }

// class Branch {
//   constructor() {
//     this.segments = random(5, 8);
//     this.startAngle = random(-90, 90);
//     this.angle = map(this.startAngle, -90, 90, -10, 10);
//     this.theta = 0;
//     this.num = 0;
//   }

//   branch(len) {
//     len *= 0.75;
//     this.theta = this.angle + Math.sin(len + this.num) * 5;
//     strokeWeight(map(len, 0.1, 7, 1, 10))
//     line(0, 0, 0, -len*10);
//     // ellipse(0, 0, t, t);
//     translate(0, -len*10);
//     if (len > 2) {
//       push();
//       rotate(radians(-this.theta));
//       this.branch(len);
//       pop();
//     } else {
//       for (let i = 0; i < 360; i += 30) {
//         let x = Math.sin(radians(i)) * 10;
//         let y = Math.cos(radians(i)) * 10;
//         line(0, 0, x, y);
//       }
//     }
//     this.num += 0.003;
//   }
// }