// declare variables and objects
const gridElement = document.querySelector("#grid");
let isAnimating = false;
const SQUARE_SIZE = 64;

const grid = {
  numRows: 4,
  numCols: 4,
  cells: [],
};

const cell = {
  id: null,
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

// game objects
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

// ui objects
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

// handle DIRECTIONAL MOVEMENT
// bc the direction affects the order of the loop

// 'Left' move
// TODO: fix bug where doesn't slide throuhg multiple empty spaces
function moveLeft() {
  for (let x = grid.numCols - 1; x >= 0; x--) {
    gridLogger();
    for (let y = 0; y < grid.numCols; y++) {
      processCellMovement(x, y, "left");
    }
  }
}

// 'Right' move
function moveRight() {
  for (let x = 0; x < grid.numRows; x++) {
    for (let y = 0; y < grid.numRows; y++) {
      // processing for 'right' mov
      processCellMovement(x, y, "right");
    }
  }
}

// 'Up' move
function moveUp() {
  for (let y = grid.numRows - 1; y >= 0; y--) {
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
  // has values to get next cell
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
  // copy this cell
  let currentCell = { ...grid.cells[y][x] };

  if (currentCell.value === null) return;

  const nextCell = checkNextCell(x, y, key);

  if (nextCell === undefined) return;

  // if this tile and next tile are same value, then merge
  if (nextCell.value === currentCell.value) {
    const nextValue = parseInt(currentCell.value) * 2;

    grid.cells[y][x].value = null;
    grid.cells[nextCell.y][nextCell.x].value = nextValue;
  }
  // if the next tile is empty, then move
  if (nextCell.value === null) {
    grid.cells[y][x].value = null;
    grid.cells[nextCell.y][nextCell.x].value = parseInt(currentCell.value);
  }
}

// handle debugging
const gridLogger = () => {
  console.table(grid.cells.map((row) => row.map((cell) => cell.value)));
};

const generateCell = () => {
  // select cell until it doesn't have a value
  let randX = Math.floor(Math.random() * grid.numCols);
  let randY = Math.floor(Math.random() * grid.numRows);
  while (grid.cells[randY][randX].value !== null) {
    randX = Math.floor(Math.random() * grid.numCols);
    randY = Math.floor(Math.random() * grid.numRows);
  }
  // generate new cell
  grid.cells[randY][randX].value = 2;
};

// handle dom events
const handleKeyUp = (e) => {
  if (e.key === "a" || e.key === "ArrowUp") moveUp();
  if (e.key === "s" || e.key === "ArrowDown") moveDown();
  if (e.key === "d" || e.key === "ArrowRight") moveRight();
  if (e.key === "w" || e.key === "ArrowLeft") moveLeft();

  // generate a new cell
  generateCell();

  // update ui
  renderGrid();
};

// add event listeners
document.addEventListener("keyup", handleKeyUp);

const init = () => {
  createGridCells();
  // initalize some cells:
  //   for (let x = 0; x < grid.numCols; x++) {
  //     for (let y = 0; y < grid.numRows; y++) {
  //       if (x < 4 && y < 4) {
  //         grid.cells[y][x].value = 2;
  //       }
  //     }
  //   }
  gridLogger();

  renderGrid();
};

function gameLoop() {
  generateCell();
  generateCell();
  renderGrid();
}

init();
gameLoop();
