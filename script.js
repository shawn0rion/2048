// declare variables
const gridElement = document.querySelector("#grid");
let isAnimating = false;
const SQUARE_SIZE = 64;

const grid = {
  numRows: 4,
  numCols: 4,
  cells: [],
};

const cell = {
  x: 0,
  y: 0,
  value: null,
  size: SQUARE_SIZE,
  element: null,
};

const directions = {
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
};

const createGridCells = () => {
  for (let y = 0; y < grid.numRows; y++) {
    // create row
    grid.cells[y] = [];
    for (let x = 0; x < grid.numCols; x++) {
      // define cell object
      let tempCell = { ...cell, x: x, y: y };
      grid.cells[y][x] = tempCell;
    }
  }
};

const renderGrid = () => {
  // append children to gridElement
  gridElement.innerHTML = "";
  for (let y = 0; y < grid.numRows; y++) {
    for (let x = 0; x < grid.numCols; x++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      cellElement.textContent = grid.cells[y][x].value;
      grid.cells[y][x].element = cellElement;
      gridElement.appendChild(cellElement);
    }
  }

  // add cell class to element
  // access grid.cells[y][x].element and set to cellElement
};

// handle MOVEMENT

// 'Left' move
function moveLeft() {
  for (let x = 0; x < grid.numRows; x++) {
    for (let y = 0; y < grid.numCols; y++) {
      processCellMovement(x, y, "left");
    }
  }
}

// 'Right' move
function moveRight() {
  for (let x = 0; x < grid.numRows; x++) {
    for (let y = grid.numCols - 1; y >= 0; y--) {
      // processing for 'right' mov
      processCellMovement(x, y, "right");
    }
  }
}

// 'Up' move
function moveUp() {
  for (let y = grid.numRows - 1; y >= 0; y--) {
    gridLogger();
    for (let x = 0; x < grid.numCols; x++) {
      // processing for 'up' move
      processCellMovement(x, y, "up");
    }
  }
}

// 'Down' move
function moveDown() {
  for (let y = 0; y < grid.numRows; y++) {
    for (let x = 0; x < grid.numCols; x++) {
      processCellMovement(x, y, "down");
    }
  }
}

const checkNextCell = (x, y, key) => {
  const direction = directions[key];

  // handle out of bounds
  if (x === 0 && key === "left") return;
  if (x === grid.numCols - 1 && key === "right") return;
  if (y === 0 && key === "up") return;
  if (y === grid.numRows - 1 && key == "down") return;

  const nextCell = grid.cells[y + direction.dy][x + direction.dx];

  return nextCell;
};

function processCellMovement(x, y, key) {
  let currentCell = { ...grid.cells[y][x] };
  if (currentCell.value === null) return;

  const nextCell = checkNextCell(x, y, key);

  if (nextCell === undefined) return;
  if (nextCell.value === currentCell.value) {
    const nextValue = parseInt(currentCell.value) * 2;

    grid.cells[y][x].value = null;
    grid.cells[nextCell.y][nextCell.x].value = nextValue;
  }
  if (nextCell.value === null) {
    grid.cells[y][x].value = null;
    grid.cells[nextCell.y][nextCell.x].value = parseInt(currentCell.value);
  }
}

const gridLogger = () => {
  console.table(grid.cells.map((row) => row.map((cell) => cell.value)));
};

// handle dom events
const handleKeyDown = (e) => {
  if (e.key === "a" || e.key === "ArrowUp") moveUp();
  if (e.key === "s" || e.key === "ArrowDown") moveDown();
  if (e.key === "d" || e.key === "ArrowRight") moveRight();
  if (e.key === "w" || e.key === "ArrowLeft") moveLeft();

  renderGrid();
};

// add event listeners
document.addEventListener("keydown", handleKeyDown);

const init = () => {
  createGridCells();
  // initalize some cells:
  for (let x = 0; x < grid.numCols; x++) {
    for (let y = 0; y < grid.numRows; y++) {
      if (x < 4 && y < 4) {
        grid.cells[y][x].value = 2;
      }
    }
  }
  gridLogger();
  renderGrid();
};

init();
