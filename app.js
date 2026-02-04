const PUZZLE_SIZE = 3;
const puzzle = document.getElementById('puzzle');
const selector = document.getElementById('imageSelector');

let state = [];
let emptyIndex = 8;
let currentImage = '';

fetch('imagenes.json')
  .then(res => res.json())
  .then(data => initSelector(data.imagenes));

function initSelector(imagenes) {
  imagenes.forEach((img, index) => {
    const option = document.createElement('option');
    option.value = img.archivo;
    option.textContent = img.nombre;
    selector.appendChild(option);
    if (index === 0) currentImage = img.archivo;
  });

  selector.addEventListener('change', e => {
    currentImage = e.target.value;
    initPuzzle();
  });

  initPuzzle();
}

function initPuzzle() {
  state = [...Array(8).keys()].map(n => n + 1).concat(0);
  emptyIndex = 8;

  shuffle();
  render();
}

function shuffle() {
  for (let i = 0; i < 100; i++) {
    const moves = validMoves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    swap(move, emptyIndex);
    emptyIndex = move;
  }
}

function validMoves() {
  const moves = [];
  const row = Math.floor(emptyIndex / PUZZLE_SIZE);
  const col = emptyIndex % PUZZLE_SIZE;

  if (row > 0) moves.push(emptyIndex - PUZZLE_SIZE);
  if (row < PUZZLE_SIZE - 1) moves.push(emptyIndex + PUZZLE_SIZE);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < PUZZLE_SIZE - 1) moves.push(emptyIndex + 1);

  return moves;
}

function swap(i, j) {
  [state[i], state[j]] = [state[j], state[i]];
}

function render() {
  puzzle.innerHTML = '';

  state.forEach((value, index) => {
    const div = document.createElement('div');

    if (value === 0) {
      div.className = 'piece empty';
    } else {
      const x = (value - 1) % PUZZLE_SIZE;
      const y = Math.floor((value - 1) / PUZZLE_SIZE);

      div.className = 'piece';
      div.style.backgroundImage = `url(${currentImage})`;
      div.style.backgroundPosition = `-${x * 100}% -${y * 100}%`;

      div.addEventListener('click', () => movePiece(index));
    }

    puzzle.appendChild(div);
  });
}

function movePiece(index) {
  if (!validMoves().includes(index)) return;

  swap(index, emptyIndex);
  emptyIndex = index;
  render();
}
