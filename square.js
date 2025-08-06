class Square {
  constructor(x, y, w, img) {
    this.pos = createVector(x, y);
    this.dim = createVector(w, w);
    this.img = img;

    this.animating = false;
  }

  draw(hovering) {
    stroke(255);
    noFill();
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    image(this.img, this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    if (hovering) {
      noStroke();
      fill(220, 100);
      rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    }

    if (this.animating) {
      this.pos = interpolate(this.oldPos, this.nextPos, this.t);
      this.t += INCREMENT;
      if (this.t > 1) {
        this.animating = false;
        this.pos = this.nextPos.copy();
      }
    }
  }

  move(squares) {
    const emptySquarePos = findEmpty(
      squares,
      this.pos.x,
      this.pos.y,
      this.dim.x,
    );

    if (emptySquarePos === undefined)
      return console.log("Square cannot be moved anywhere.");

    this.oldPos = this.pos.copy();
    this.nextPos = emptySquarePos.copy();
    this.animating = true;
    this.t = 0;
  }

  canMove(squares) {
    return findEmpty(squares, this.pos.x, this.pos.y, this.dim.x) !== undefined;
  }
}

function findEmpty(squares, x, y, w) {
  const fakeSquares = Array.from({ length: DIM * DIM }, (_, i) => ({
    pos: createVector(
      ((i % DIM) * width) / DIM,
      (Math.floor(i / DIM) * width) / DIM,
    ),
  }));
  const expectedNeighbours = generateNeighbours(fakeSquares, x, y, w);
  const actualNeighbours = generateNeighbours(squares, x, y, w);

  if (expectedNeighbours.length !== actualNeighbours.length) {
    const actualNeighboursSet = new Set(
      actualNeighbours.map((obj) => JSON.stringify(obj)),
    );
    return expectedNeighbours.find(
      (obj) => !actualNeighboursSet.has(JSON.stringify(obj)),
    );
  }

  return undefined;
}

function generateNeighbours(squares, x, y, w) {
  const neighbours = [];
  for (const { pos } of squares) {
    if (
      x - w <= pos.x &&
      pos.x <= x + w &&
      y - w <= pos.y &&
      pos.y <= y + w &&
      Math.abs(pos.x - x) !== Math.abs(pos.y - y)
    )
      neighbours.push(pos.copy());
  }
  return neighbours;
}

function interpolate(v1, v2, t) {
  return p5.Vector.lerp(v1, v2, easingFunction(t));
}

function easingFunction(t) {
  // return t;
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
