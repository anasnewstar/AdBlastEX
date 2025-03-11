/**
 * AdBlast Games
 * This file contains the functionality for the games on the AdBlast landing page.
 * Each game serves as an engagement tool to keep users on the page longer,
 * increasing ad exposure and potential clicks.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all games
    initTicTacToe();
    initMemoryGame();
    initRockPaperScissors();

    // Set up game toggle buttons
    setupGameToggles();

    // After each game action (move, win, etc.), trigger an ad check
    // This subtly associates playing the game with seeing ads
    function checkForAdOpportunity() {
        // 15% chance to trigger an ad after a game action
        if (Math.random() < 0.15) {
            // Small delay before attempting to open an ad
            setTimeout(() => {
                if (typeof window.adDelivery !== 'undefined' && window.adDelivery.openAdTab) {
                    window.adDelivery.openAdTab();
                }
            }, 500);
        }
    }

    // Setup play/hide toggles for each game
    function setupGameToggles() {
        // Tic-Tac-Toe toggle
        document.getElementById('play-tictactoe').addEventListener('click', function () {
            const preview = this.parentElement;
            const board = document.getElementById('tictactoe-board');
            preview.style.display = 'none';
            board.style.display = 'block';
            checkForAdOpportunity();
        });

        // Memory game toggle
        document.getElementById('play-memory').addEventListener('click', function () {
            const preview = this.parentElement;
            const board = document.getElementById('memory-board');
            preview.style.display = 'none';
            board.style.display = 'block';
            initMemoryCards(); // Initialize cards when game is shown
            checkForAdOpportunity();
        });

        // Rock Paper Scissors toggle
        document.getElementById('play-rps').addEventListener('click', function () {
            const preview = this.parentElement;
            const board = document.getElementById('rps-board');
            preview.style.display = 'none';
            board.style.display = 'block';
            checkForAdOpportunity();
        });

        // Reset buttons - reset the game but keep it visible
        document.getElementById('reset-tictactoe').addEventListener('click', resetTicTacToe);
        document.getElementById('reset-memory').addEventListener('click', resetMemoryGame);
        document.getElementById('reset-rps').addEventListener('click', resetRPS);
    }

    // =======================================
    // Tic-Tac-Toe Game Implementation
    // =======================================
    let currentPlayer = 'X';
    let tttBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function initTicTacToe() {
        const cells = document.querySelectorAll('.ttt-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        resetTicTacToe();
    }

    function handleCellClick() {
        const cellIndex = parseInt(this.getAttribute('data-index'));

        if (tttBoard[cellIndex] !== '' || !gameActive) {
            return;
        }

        // Update board state
        tttBoard[cellIndex] = currentPlayer;
        this.textContent = currentPlayer;
        this.classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        if (checkWin()) {
            document.getElementById('ttt-status').textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            checkForAdOpportunity(); // Higher chance on game completion
            return;
        }

        if (checkDraw()) {
            document.getElementById('ttt-status').textContent = "Game ended in a draw!";
            gameActive = false;
            checkForAdOpportunity(); // Higher chance on game completion
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('ttt-status').textContent = `Player ${currentPlayer}'s turn`;

        // If playing against computer (player O), make computer move
        if (currentPlayer === 'O') {
            setTimeout(makeComputerMove, 500);
        }

        checkForAdOpportunity();
    }

    function makeComputerMove() {
        if (!gameActive) return;

        // Simple AI - find empty cell
        const emptyCells = tttBoard.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        if (emptyCells.length === 0) return;

        // Choose random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];

        // Update board state
        tttBoard[cellIndex] = currentPlayer;
        const cell = document.querySelector(`.ttt-cell[data-index="${cellIndex}"]`);
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        if (checkWin()) {
            document.getElementById('ttt-status').textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            checkForAdOpportunity();
            return;
        }

        if (checkDraw()) {
            document.getElementById('ttt-status').textContent = "Game ended in a draw!";
            gameActive = false;
            checkForAdOpportunity();
            return;
        }

        // Switch back to player X
        currentPlayer = 'X';
        document.getElementById('ttt-status').textContent = `Player ${currentPlayer}'s turn`;
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return tttBoard[a] !== '' && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c];
        });
    }

    function checkDraw() {
        return !tttBoard.includes('');
    }

    function resetTicTacToe() {
        tttBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';

        document.querySelectorAll('.ttt-cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });

        document.getElementById('ttt-status').textContent = `Player ${currentPlayer}'s turn`;
        checkForAdOpportunity();
    }

    // =======================================
    // Memory Game Implementation
    // =======================================
    let memoryCards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let pairs = 0;
    const totalPairs = 8;

    function initMemoryGame() {
        document.getElementById('reset-memory').addEventListener('click', resetMemoryGame);
    }

    function initMemoryCards() {
        // Create card data with pairs
        const cardValues = ['🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎬', '🎤'];
        const cardPairs = [...cardValues, ...cardValues];

        // Shuffle cards
        const shuffledCards = shuffleArray(cardPairs);

        // Create card elements
        const memoryGrid = document.getElementById('memory-grid');
        memoryGrid.innerHTML = '';

        shuffledCards.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.value = value;

            const frontFace = document.createElement('div');
            frontFace.classList.add('memory-card-front');
            frontFace.textContent = value;

            const backFace = document.createElement('div');
            backFace.classList.add('memory-card-back');
            backFace.textContent = '?';

            card.appendChild(frontFace);
            card.appendChild(backFace);
            card.addEventListener('click', flipCard);

            memoryGrid.appendChild(card);
        });

        // Reset game state
        resetMemoryGame();
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Second card flipped
        secondCard = this;
        moves++;
        updateMemoryStatus();

        checkForMatch();
        checkForAdOpportunity();
    }

    function checkForMatch() {
        // Check if cards match
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            disableCards();
            pairs++;
            updateMemoryStatus();

            // Check if game completed
            if (pairs === totalPairs) {
                setTimeout(() => {
                    document.getElementById('memory-status').textContent = `You win! Completed in ${moves} moves`;
                    checkForAdOpportunity(); // Higher chance on game completion
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateMemoryStatus() {
        document.getElementById('memory-status').textContent = `Moves: ${moves} | Pairs: ${pairs}/${totalPairs}`;
    }

    function resetMemoryGame() {
        const memoryGrid = document.getElementById('memory-grid');
        memoryGrid.innerHTML = '';
        initMemoryCards();

        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
        moves = 0;
        pairs = 0;
        updateMemoryStatus();
        checkForAdOpportunity();
    }

    // =======================================
    // Rock Paper Scissors Implementation
    // =======================================
    let playerScore = 0;
    let computerScore = 0;

    function initRockPaperScissors() {
        document.getElementById('rock').addEventListener('click', () => playRPS('rock'));
        document.getElementById('paper').addEventListener('click', () => playRPS('paper'));
        document.getElementById('scissors').addEventListener('click', () => playRPS('scissors'));
        document.getElementById('reset-rps').addEventListener('click', resetRPS);
    }

    function playRPS(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];

        // Update display
        updateRPSDisplay(playerChoice, computerChoice);

        // Determine winner
        const result = determineWinner(playerChoice, computerChoice);

        // Update score
        if (result === 'player') {
            playerScore++;
            document.getElementById('rps-status').textContent = 'You win this round!';
        } else if (result === 'computer') {
            computerScore++;
            document.getElementById('rps-status').textContent = 'Computer wins this round!';
        } else {
            document.getElementById('rps-status').textContent = "It's a tie!";
        }

        // Update score display
        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('computer-score').textContent = computerScore;

        checkForAdOpportunity();
    }

    function updateRPSDisplay(playerChoice, computerChoice) {
        const playerIcon = document.getElementById('player-icon');
        const computerIcon = document.getElementById('computer-icon');

        // Map choices to icons
        const iconMap = {
            'rock': '<i class="fas fa-hand-rock"></i>',
            'paper': '<i class="fas fa-hand-paper"></i>',
            'scissors': '<i class="fas fa-hand-scissors"></i>'
        };

        playerIcon.innerHTML = iconMap[playerChoice];
        computerIcon.innerHTML = iconMap[computerChoice];
    }

    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }

        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }

    function resetRPS() {
        playerScore = 0;
        computerScore = 0;
        document.getElementById('player-score').textContent = '0';
        document.getElementById('computer-score').textContent = '0';
        document.getElementById('player-icon').innerHTML = '?';
        document.getElementById('computer-icon').innerHTML = '?';
        document.getElementById('rps-status').textContent = 'Choose your move!';
        checkForAdOpportunity();
    }

    // =======================================
    // Utility Functions
    // =======================================
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Trigger higher chance of ad at page load
    setTimeout(checkForAdOpportunity, 2000);
}); 