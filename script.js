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

let ball;
let ballSize = 80;
let yspeed = 0.5;
let xspeed = 1.0;
let lives = 10;
let livestext;
let gameovertext;


function preload() {
    this.load.image("ball", "assets/ball.png"); // watch out for case sensitivity
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

    // Make the ball interactive
    ball.setInteractive();

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

    // The || sign means "or"
    if (ball.y >= HEIGHT - ballSize / 2 || ball.y <= ballSize / 2) {
        // Multiplying by -1 will "flip" the direction
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
}
function checkGameOver() {
    if (lives <= 0) {
        lives = 0;
        livestext.setText(`Lives: ${lives}`);
        gameovertext.setVisible(true);
        ball.setVisible(false);
    }
}