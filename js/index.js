const container = document.getElementById('container');
const boardContainer = document.getElementById('board');
const boardSizeInput = document.getElementById('boardSizeInput');
const minSize = 3, maxSize = 12;
let boardSize = minSize;
let board = [];
let currentPlayer = 'X';
let isNotificationShown = false;

setupBoard();

function setupBoard() {
    setBoardStyles();
    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    boardContainer.textContent = '';
    resetGame();
    createBoardCells();
}

function setBoardStyles() {
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    container.style.maxWidth = `${Math.min(boardSize * 100, 800)}px`;
}

function createBoardCells() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            boardContainer.appendChild(createCell(row, col));
        }
    }
}

function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener('click', handleCellClick);
    return cell;
}

function handleCellClick(event) {
    if (isNotificationShown) return;
    const { row, col } = event.target.dataset;

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;

        const cell = event.target;
        cell.classList.add(currentPlayer);

        if (checkWin(currentPlayer)) {
            showNotification(`Player ${currentPlayer} wins!`);
        } else if (isBoardFull()) {
            showNotification(`It's a draw!`);
        }

        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(player) {
    const diagonal1 = board.every((row, index) => row[index] === player);
    const diagonal2 = board.every((row, index) => row[boardSize - index - 1] === player);

    if (diagonal1 || diagonal2) {
        return true;
    }

    for (let i = 0; i < boardSize; i++) {
        if (
            board[i].every(cell => cell === player) || /* Check Row */
            board.every(row => row[i] === player) /* Check Column */
        ) {
            return true;
        }
    }

    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== ''));
}

function resetGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(''));
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'
    });
    currentPlayer = 'X';
}

function showNotification(message) {
    isNotificationShown = true;
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        isNotificationShown = false;
        resetGame();
    }, 2000);
}

function changeBoardSize() {
    if (isNotificationShown) {
        notification.style.display = 'none';
        isNotificationShown = false;
    }
    boardSize = Math.min(Math.max(+boardSizeInput.value, minSize), maxSize);
    if (+boardSizeInput.value > maxSize) boardSizeInput.value = maxSize;
    else if (+boardSizeInput.value < minSize) boardSizeInput.value = minSize;

    setupBoard();
}