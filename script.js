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
let lives = 10;
let livestext;
let gameovertext;
let ballXSpeed = 1.0;
let ballYSpeed = 0.5;
let pokeballXSpeed = -1.0;
let pokeballYSpeed = -0.5;


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
        ballXSpeed *= 1.1;
        ballYSpeed *= 1.1;
        lives+= 1;
        livestext.setText(`Lives: ${lives}`);
    });
    pokeball.on('pointerdown', () => {
        // Decrease size by 10%
        ballSize *= 0.9;
        pokeball.setDisplaySize(ballSize, ballSize);

        // Increase speed by 10%
        pokeballXSpeed *= 1.1;
        pokeballYSpeed *= 1.1;
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
    ball.x += ballXSpeed;
    ball.y += ballYSpeed;
    pokeball.x += pokeballXSpeed;
    pokeball.y += pokeballYSpeed;

    // Collision detection between ball and pokeball
    const dx = ball.x - pokeball.x;
    const dy = ball.y - pokeball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ballSize) {
        // Calculate the angle of collision
        const angle = Math.atan2(dy, dx);

        // Get speeds in the direction of the collision
        const speed1 = Math.cos(angle) * ballXSpeed + Math.sin(angle) * ballYSpeed;
        const speed2 = Math.cos(angle) * pokeballXSpeed + Math.sin(angle) * pokeballYSpeed;

        // Swap the speeds
        ballXSpeed += Math.cos(angle) * (speed2 - speed1);
        ballYSpeed += Math.sin(angle) * (speed2 - speed1);
        pokeballXSpeed += Math.cos(angle) * (speed1 - speed2);
        pokeballYSpeed += Math.sin(angle) * (speed1 - speed2);

        // Move them apart so they don't stick
        const overlap = ballSize - distance;
        ball.x += Math.cos(angle) * (overlap / 2);
        ball.y += Math.sin(angle) * (overlap / 2);
        pokeball.x -= Math.cos(angle) * (overlap / 2);
        pokeball.y -= Math.sin(angle) * (overlap / 2);
    }

    // The || sign means "or"
    if (ball.y >= HEIGHT - ballSize / 2 || ball.y <= ballSize / 2) {
        ballYSpeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (ball.x >= WIDTH - ballSize / 2 || ball.x <= ballSize / 2) {
        ballXSpeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (pokeball.y >= HEIGHT - ballSize / 2 || pokeball.y <= ballSize / 2) {
        pokeballYSpeed *= -1;
        lives -= 1;
        livestext.setText(`Lives: ${lives}`);
        checkGameOver();
    }
    if (pokeball.x >= WIDTH - ballSize / 2 || pokeball.x <= ballSize / 2) {
        pokeballXSpeed *= -1;
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