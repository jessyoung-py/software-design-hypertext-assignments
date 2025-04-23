let numRects = 100;
let noiseFactorR = 0.01;
let noiseFactorG = 0.02; 
let noiseFactorB = 0.03;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1'); 
  canvas.style('position', 'fixed');
  noStroke();
}

function draw() {
  let gridSize = width / numRects;

  for (let y = 0; y < numRects; y++) {
    for (let x = 0; x < numRects; x++) {
      let R = noise(x * noiseFactorR, y * noiseFactorR, frameCount * noiseFactorR) * 255;
      let G = noise(x * noiseFactorG, y * noiseFactorG, frameCount * noiseFactorG) * 255;
      let B = noise(x * noiseFactorB, y * noiseFactorB, frameCount * noiseFactorB) * 255;
      fill(R, G, B);
      rect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }
}