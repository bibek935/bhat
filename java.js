// --- Element Selectors ---
const cells = document.querySelectorAll('.cell');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const visibilityTimeSelect = document.getElementById('visibility-time');
const hitSound = document.getElementById('hit-sound');

// --- Game State Variables ---
let score = 0;
let timeLeft = 30; // Game duration in seconds
let timerId = null; // Holds the ID for the main game timer (30 seconds)
let moleTimerId = null; // Holds the ID for the mole appearance timer
let currentMoleCell = null; // Tracks the cell where the mole is currently visible
let moleVisibleTime = 1000; // Default: 1000ms (1 second)

// --- Functions ---

// 1. Randomly selects a cell for the mole to appear in
function randomCell() {
    // 1. Remove the mole from the previous cell, if any
    cells.forEach(cell => cell.classList.remove('mole-visible'));

    // 2. Select a random cell
    const randomIndex = Math.floor(Math.random() * 9);
    const randomCell = cells[randomIndex];

    // 3. Mark the new cell as the current mole cell
    randomCell.classList.add('mole-visible');
    currentMoleCell = randomCell;
}

// 2. Starts the mole appearance loop
function moveMole() {
    // Get the selected visibility time from the dropdown
    moleVisibleTime = parseInt(visibilityTimeSelect.value);
    
    // Set a recurring timer: the mole pops up, stays for 'moleVisibleTime', then moves to a new random spot
    moleTimerId = setInterval(() => {
        randomCell();
    }, moleVisibleTime);
}

// 3. Handles the main 30-second game countdown
function countdown() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timerId); // Stop the main timer
        clearInterval(moleTimerId); // Stop the mole movement
        cells.forEach(cell => cell.classList.remove('mole-visible')); // Hide any visible mole
        startButton.disabled = false; // Re-enable the start button

        // Game over message (could use an alert or a modal)
        alert(`Game Over! Your final score is ${score}.`);
    }
}

// 4. Handles a click on any of the cells
function hitHandler(event) {
    // Check if the clicked cell is the one currently showing the mole AND the game is running
    if (event.target === currentMoleCell && timeLeft > 0) {
        score++;
        scoreDisplay.textContent = score;

        // Play the sound effect
        hitSound.currentTime = 0; // Rewind to start in case it's already playing
        hitSound.play();

        // Immediately hide the mole and force it to move for instant feedback
        currentMoleCell.classList.remove('mole-visible');
        currentMoleCell = null; // Prevents double-hitting the same mole
    }
}

// 5. Starts (or restarts) the game
function startGame() {
    // Reset state
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    currentMoleCell = null;

    // Clear any previous timers to ensure a clean restart
    clearInterval(timerId);
    clearInterval(moleTimerId);
    
    // Disable the button while the game is running
    startButton.disabled = true;

    // Start the main 30-second countdown
    timerId = setInterval(countdown, 1000); // 1000ms = 1 second

    // Start the mole moving
    moveMole();
}

// --- Event Listeners ---

// 1. Start button listener
startButton.addEventListener('click', startGame);

// 2. Cell click listener (using event delegation for simplicity)
cells.forEach(cell => cell.addEventListener('click', hitHandler));