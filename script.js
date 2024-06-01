let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playWithAI = false;  // New variable to track game mode
const humanPlayer = 'X';
const aiPlayer = 'O';

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetBtn');
const messageElement = document.getElementById('message');
const gameModeElement = document.getElementById('game-mode');

gameModeElement.addEventListener('change', setGameMode);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function setGameMode() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    playWithAI = (mode === 'ai');
    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive || (playWithAI && currentPlayer !== humanPlayer)) {
        return;
    }

    makeMove(clickedCellIndex, currentPlayer);
    if (gameActive && playWithAI) {
        setTimeout(aiMove, 500); // AI makes a move after a short delay
    }
}

function makeMove(index, player) {
    board[index] = player;
    document.querySelector(`.cell[data-index='${index}']`).innerText = player;
    checkResult();
}

function aiMove() {
    const bestMove = getBestMove();
    makeMove(bestMove, aiPlayer);
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        'O': 10,
        'X': -10,
        'tie': 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes('') ? null : 'tie';
}

function checkResult() {
    let result = checkWinner();
    if (result !== null) {
        if (result === 'tie') {
            messageElement.innerText = 'Draw!';
        } else {
            messageElement.innerText = `Player ${result} wins!`;
        }
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    messageElement.innerText = '';
    cells.forEach(cell => cell.innerText = '');
}
