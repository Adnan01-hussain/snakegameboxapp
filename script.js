const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 160, y: 160 }];
let food = generateFood();
let score = 0;
let direction = 'RIGHT';
let changingDirection = false;
let gameInterval;

// Update score
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasSize / box) * box,
        y: Math.floor(Math.random() * canvasSize / box) * box
    };
}

// Draw the snake and food
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
}

// Move the snake
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        updateScore();
    } else {
        snake.pop();
    }
}

// Check for collisions
function checkCollisions() {
    let head = snake[0];

    // Check wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Check self collisions
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Change direction based on user input
function changeDirection(event) {
    if (changingDirection) return;

    changingDirection = true;

    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
}

// Start the game
function startGame() {
    score = 0;
    snake = [{ x: 160, y: 160 }];
    direction = "RIGHT";
    changingDirection = false;
    food = generateFood();
    updateScore();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

// Game loop
function gameLoop() {
    moveSnake();
    draw();

    if (checkCollisions()) {
        clearInterval(gameInterval);
        alert('Game Over!');
        document.getElementById('startBtn').style.display = 'block';
    }

    changingDirection = false;
}

// Event listener for key presses
document.addEventListener("keydown", changeDirection);

// Start button event listener
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startBtn').style.display = 'none';
    startGame();
});
