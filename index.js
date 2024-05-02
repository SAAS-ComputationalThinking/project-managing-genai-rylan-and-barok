const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800; // Set canvas width
canvas.height = 600; // Set canvas height

let gameStarted = false;
let gameOver = false;

// Bird
const bird = {
    x: 100,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -9,

    jump: function() {
        this.velocity = this.jumpStrength;
    },

    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    },

    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }
};

// Controls
document.addEventListener('keydown', function(event) {
    if (!gameOver && (event.code === 'Space' || event.code === 'KeyW')) {
        if (!gameStarted) gameStarted = true;
        bird.jump();
    }
});

canvas.addEventListener('click', function() {
    if (!gameOver) {
        if (!gameStarted) gameStarted = true;
        bird.jump();
    }
});

// Pipes
const pipes = [];
const pipeGap = 250; // Increased pipe gap for easier gameplay
const pipeWidth = 50;
const pipeSpeed = 3;
const pipeSpawnRate = 1500;
let lastSpawnTime = 0;

function spawnPipe() {
    const pipeY = Math.random() * (canvas.height - pipeGap * 2) + pipeGap;
    pipes.push({
        x: canvas.width,
        y: pipeY,
        width: pipeWidth,
        height: canvas.height - pipeY
    });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= pipeSpeed;

        if (pipe.x + pipe.width <= 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    if (!gameOver && Date.now() - lastSpawnTime > pipeSpawnRate) {
        spawnPipe();
        lastSpawnTime = Date.now();
    }
}

function drawPipes() {
    for (const pipe of pipes) {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, pipe.height);
    }
}

// Collision Detection
function detectCollision() {
    for (const pipe of pipes) {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.y || bird.y + bird.radius > pipe.y + pipeGap)
        ) {
            return true;
        }
    }
    return false;
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    if (gameStarted && !gameOver) {
        updatePipes();
        drawPipes();

        if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0 || detectCollision()) {
            gameOver = true;
        }
    }

    if (gameOver) {
        // Game over
        alert("Game Over! Press OK to restart.");
        pipes.length = 0;
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        lastSpawnTime = Date.now();
        gameStarted = false;
        gameOver = false;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();