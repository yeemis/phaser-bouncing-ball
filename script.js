let WIDTH = 800;
let HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let pokeball
let ball;
let ballSize = 80;
let yspeed = 0.5;
let xspeed = 1.0;
let lives = 10;
let livestext;
let gameovertext;


function preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("pokeball","assets/pokeball.png") // watch out for case sensitivity
}

function create() {
    gameovertext = this.add.text(WIDTH / 2, HEIGHT / 2, "Game Over", {
        fontSize: '64px',
        fill: '#ff0000'
    });
    gameovertext.setOrigin(0.5);
    gameovertext.setVisible(false);
    ball = this.add.sprite(WIDTH / 2, HEIGHT / 2, "ball");
    ball.setDisplaySize(ballSize, ballSize);
    pokeball = this.add.sprite(WIDTH / 2, HEIGHT / 2, "pokeball");
    pokeball.setDisplaySize(ballSize, ballSize);

    // Make the ball interactive
    ball.setInteractive();
    pokeball.setInteractive();

    // On click, shrink and speed up the ball
    ball.on('pointerdown', () => {
        // Decrease size by 10%
        ballSize *= 0.9;
        ball.setDisplaySize(ballSize, ballSize);

        // Increase speed by 10%
        xspeed *= 1.1;
        yspeed *= 1.1;
        lives+= 1;
        livestext.setText(`Lives: ${lives}`);
    });
    pokeball.on('pointerdown', () => {
        // Decrease size by 10%
        ballSize *= 0.9;
        pokeball.setDisplaySize(ballSize, ballSize);

        // Increase speed by 10%
        xspeed *= 1.1;
        yspeed *= 1.1;
        lives+= 1;
        livestext.setText(`Lives: ${lives}`);
    });

    livestext = this.add.text(10, 10, `Lives: ${lives}`, {
        fontSize: '24px',
        fill: '#ff0000'
    });
}

function update() {
    if (lives <= 0) {
        return; // Stop the game if lives are zero
    }
    ball.y += yspeed;
    ball.x += xspeed;
    pokeball.y += yspeed * 3; // Pokeball moves faster than the ball
    pokeball.x += xspeed;

    // Collision detection between ball and pokeball
    const dx = ball.x - pokeball.x;
    const dy = ball.y - pokeball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ballSize) {
        // Simple bounce: reverse directions
        xspeed *= -1.1;
        yspeed *= -1.5;
        // Move them apart so they don't stick
        const overlap = ballSize - distance;
        const angle = Math.atan2(dy, dx);
        ball.x += Math.cos(angle) * (overlap / 2);
        ball.y += Math.sin(angle) * (overlap / 2);
        pokeball.x -= Math.cos(angle) * (overlap / 2);
        pokeball.y -= Math.sin(angle) * (overlap / 2);
    }

    // The || sign means "or"
    if (ball.y >= HEIGHT - ballSize / 2 || ball.y <= ballSize / 2) {
        yspeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (ball.x >= WIDTH - ballSize / 2 || ball.x <= ballSize / 2) {
        xspeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (pokeball.y >= HEIGHT - ballSize / 2 || pokeball.y <= ballSize / 2) {
        yspeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (pokeball.x >= WIDTH - ballSize / 2 || pokeball.x <= ballSize / 2) {
        xspeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
}
function checkGameOver() {
    if (lives <= 0) {
        lives = 0;
        livestext.setText(`Lives: ${lives}`);
        gameovertext.setVisible(true);
        ball.setVisible(false);
        pokeball.setVisible(false);
    }
}