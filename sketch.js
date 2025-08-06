let INCREMENT = 0.05;

let slidingImage;
let DIM = 4;

let w;

const squares = [];

const hover = { x: -100, y: -100 };

let shuffling = false;
let i = 0;

function preload() {
  // slidingImage = loadImage("numbers.png");
  slidingImage = loadImage("duck.png");
}

function setup() {
  createCanvas(600, 600);

  w = width / DIM;
  let imgw = slidingImage.width / DIM;

  for (let i = 0; i < DIM * DIM; i++) {
    const square = new Square(
      (i % DIM) * w,
      Math.floor(i / DIM) * w,
      w,
      slidingImage.get(
        (i % DIM) * imgw,
        Math.floor(i / DIM) * imgw,
        imgw,
        imgw,
      ),
    );

    squares.push(square);
  }

  // Remove the bottom right square
  squares.pop();
}

function draw() {
  background(0);

  for (const square of squares) {
    if (withinSquare(square)) {
      hover.x = square.pos.x;
      hover.y = square.pos.y;
    }
    square.draw(hover.x === square.pos.x && hover.y === square.pos.y);
  }

  if (shuffling && !squares.some((square) => square.animating)) {
    shuffleSquares(squares);
    i++;
    if (i >= 100) {
      shuffling = false;
      INCREMENT = 0.05;
      i = 0;
    }
  }

  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    hover.x = -100;
    hover.y = -100;
  }
}

function keyPressed() {
  if (key === "s" && !squares.some((square) => square.animating)) {
    shuffling = true;
    INCREMENT = 0.5;
  }
}

function mousePressed() {
  if (squares.some((square) => square.animating)) return;
  for (const square of squares) {
    if (withinSquare(square)) square.move(squares);
  }
}

function withinSquare(square) {
  const { pos, dim } = square;

  return (
    pos.x <= mouseX &&
    mouseX <= pos.x + dim.x &&
    pos.y <= mouseY &&
    mouseY <= pos.y + dim.y
  );
}

function shuffleSquares(squares) {
  while (true) {
    const index = Math.floor(Math.random() * squares.length);
    if (squares[index].canMove(squares)) {
      squares[index].move(squares);
      break;
    }
  }
}
