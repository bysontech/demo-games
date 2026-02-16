const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

// Game state
let gameOver = false;
let score = 0;
let gameSpeed = 2;

// Player object
const player = {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocityY: 0,
    velocityX: 0,
    jumpPower: -12,
    gravity: 0.6,
    onGround: false,
    color: '#FF0000'
};

// Ground
const ground = {
    y: 350,
    height: 50
};

// Obstacles (platforms and holes)
const obstacles = [];

// Enemies
const enemies = [];

// Keyboard state
const keys = {};

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    // Jump
    if (e.code === 'Space' && player.onGround && !gameOver) {
        player.velocityY = player.jumpPower;
        player.onGround = false;
    }

    // Restart
    if (e.code === 'KeyR' && gameOver) {
        restartGame();
    }

    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Initialize obstacles
function createObstacle(x) {
    return {
        x: x,
        y: ground.y - 40,
        width: 40,
        height: 40,
        color: '#8B4513'
    };
}

// Initialize enemy
function createEnemy(x) {
    return {
        x: x,
        y: ground.y - 35,
        width: 35,
        height: 35,
        speed: gameSpeed + 1,
        color: '#800080'
    };
}

// Spawn initial obstacles and enemies
function spawnInitialObjects() {
    for (let i = 0; i < 5; i++) {
        obstacles.push(createObstacle(canvas.width + i * 400));
        enemies.push(createEnemy(canvas.width + 200 + i * 400));
    }
}

// Update player position
function updatePlayer() {
    // Horizontal movement
    player.velocityX = 0;
    if (keys['ArrowLeft']) {
        player.velocityX = -5;
    }
    if (keys['ArrowRight']) {
        player.velocityX = 5;
    }

    player.x += player.velocityX;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    // Fall off the screen - game over
    if (player.y > canvas.height) {
        gameOver = true;
    }
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;

        // Remove obstacles that are off screen and add new ones
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            obstacles.push(createObstacle(canvas.width + 100));
        }
    }
}

// Update enemies
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].x -= enemies[i].speed;

        // Remove enemies that are off screen and add new ones
        if (enemies[i].x + enemies[i].width < 0) {
            enemies.splice(i, 1);
            enemies.push(createEnemy(canvas.width + 100));
            score += 10;
            scoreDisplay.textContent = score;

            // Increase game speed gradually
            if (score % 50 === 0) {
                gameSpeed += 0.2;
            }
        }
    }
}

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check all collisions
function checkCollisions() {
    // Check collision with obstacles
    for (let obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
            gameOver = true;
        }
    }

    // Check collision with enemies
    for (let enemy of enemies) {
        if (checkCollision(player, enemy)) {
            gameOver = true;
        }
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw simple face
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(player.x + 5, player.y + 8, 8, 8);
    ctx.fillRect(player.x + 17, player.y + 8, 8, 8);

    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 8, player.y + 11, 3, 3);
    ctx.fillRect(player.x + 20, player.y + 11, 3, 3);
}

// Draw ground
function drawGround() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, ground.y, canvas.width, ground.height);

    // Draw grass on top
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, ground.y, canvas.width, 5);
}

// Draw obstacles
function drawObstacles() {
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Draw brick pattern
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
        ctx.stroke();
    }
}

// Draw enemies
function drawEnemies() {
    for (let enemy of enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Draw simple eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 8, 8);
        ctx.fillRect(enemy.x + 22, enemy.y + 8, 8, 8);

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x + 7, enemy.y + 10, 4, 4);
        ctx.fillRect(enemy.x + 24, enemy.y + 10, 4, 4);
    }
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updatePlayer();
        updateObstacles();
        updateEnemies();
        checkCollisions();
    }

    drawGround();
    drawObstacles();
    drawEnemies();
    drawPlayer();

    if (gameOver) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    gameOver = false;
    score = 0;
    gameSpeed = 2;
    scoreDisplay.textContent = score;

    player.x = 100;
    player.y = 300;
    player.velocityY = 0;
    player.velocityX = 0;

    obstacles.length = 0;
    enemies.length = 0;

    spawnInitialObjects();
}

// Initialize and start game
spawnInitialObjects();
gameLoop();
