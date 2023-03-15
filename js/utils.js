function linearGradient(sX, sY, eX, eY, ...colors){
    let gradient = drawingContext.createLinearGradient(
      sX, sY, eX, eY
    );
    const increment = 1 / (colors.length - 1)
    colors.forEach((color, i) => gradient.addColorStop(increment * i, color))
    drawingContext.fillStyle = gradient;
  }
  
  // function noisyGradient(sX, sY, eX, eY, ...colors){
  //   let gradient = drawingContext.createLinearGradient(
  //     sX, sY, eX, eY
  //   );
  //   const increment = 1 / (colors.length - 1)
  //   colors.forEach((color, i) => {
  //     const n = map(noise(i + xoff), 0, 1, -0.06, 0.06)
  //     const stop = constrain(increment * i + n, 0, 1)
  //     gradient.addColorStop(stop, color);
  //   })
  //   drawingContext.fillStyle = gradient;
  // }


  //function drawCoral() {
//   const coralPos = [[484,524],[500,492],[494,458],[454,444],[398,411],[391,297],[411,225],[424,250],[445,322],[443,363],[494,362],[509,301],[471,244],[473,192],[501,147],[554,165],[534,245],[541,282],[553,358],[579,357],[603,296],[600,192],[627,139],[674,136],[684,211],[662,280],[645,351],[647,366],[638,479],[585,486],[601,507],[560,527],[560,527]]
//   fill(255, 105, 180)
//   beginShape()
//   for(var i = 0; i < coralPos.length; i++) {
//     const [x2, y2] = coralPos[i]
//     vertex(x2, y2)
//   }
//   endShape()
// }