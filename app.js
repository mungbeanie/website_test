let canvas;
let ctx;
let updateRate = 20; // ms
let scale = 0.15;
let updateInterval = null;
let logoColour;

// TODO: fix when image gets stuck on resize edge

let dvd = {
    img: new Image(),
    // position on screen
    // top left of image
    xPos: 50,
    yPos: 100,
    // speed
    xSpeed: 10,
    ySpeed: 10,
};

const updateCanvas = () => {
    // draw the canvas background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw DVD logo and its background
    // TODO: change image filter instead of background
    ctx.fillStyle = logoColour;
    ctx.fillRect(
        dvd.xPos,
        dvd.yPos,
        dvd.img.width * scale,
        dvd.img.height * scale
    );
    ctx.drawImage(
        dvd.img,
        dvd.xPos,
        dvd.yPos,
        dvd.img.width * scale,
        dvd.img.height * scale
    );
};

const updateFrame = () => {
    updateInterval = setInterval(() => {
        updateCanvas();

        // move the logo
        dvd.xPos += dvd.xSpeed;
        dvd.yPos += dvd.ySpeed;

        // check for collision
        checkHitBox();
    }, updateRate);
};

// check for border collision
const checkHitBox = () => {
    // x hitting edge
    if (dvd.xPos + dvd.img.width * scale >= canvas.width || dvd.xPos <= 0) {
        dvd.xSpeed *= -1;
        pickColor();
    }

    // y hitting edge
    if (dvd.yPos + dvd.img.height * scale >= canvas.height || dvd.yPos <= 0) {
        dvd.ySpeed *= -1;
        pickColor();
    }
};

// check for border collision on resize
const checkHitBoxOnResize = () => {
    // x hitting edge
    xRightEdgePos = dvd.xPos + dvd.img.width * scale;
    if (xRightEdgePos > canvas.width) {
        dvd.xPos = dvd.xPos - (xRightEdgePos - canvas.width);
        dvd.xSpeed *= -1;
        pickColor();
    } else if (dvd.xPos < 0) {
        dvd.xPos = 0;
        dvd.xSpeed *= -1;
        pickColor();
    }

    // y hitting edge
    yRightEdgePos = dvd.yPos + dvd.img.width * scale;
    if (yRightEdgePos > canvas.height) {
        dvd.yPos = dvd.yPos - (yRightEdgePos - canvas.height);
        dvd.ySpeed *= -1;
        pickColor();
    } else if (dvd.yPos < 0) {
        dvd.yPos = 0;
        dvd.ySpeed *= -1;
        pickColor();
    }
};

// pick a random color in RGB 255,255,255 format
const pickColor = () => {
    let min = 0;
    let max = 255;

    const generateRandomNumberBetweenMinMax = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    r = generateRandomNumberBetweenMinMax(min, max);
    g = generateRandomNumberBetweenMinMax(min, max);
    b = generateRandomNumberBetweenMinMax(min, max);

    logoColour = `rgb(${r}, ${g}, ${b})`;
};

// main entry point
// init
const main = () => {
    canvas = document.querySelector("#tv-screen");
    ctx = canvas.getContext("2d");
    dvd.img.src = "dvd-logo.png";

    document.body.style.overflow = "hidden";
    // draw "tv screen"
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pickColor(); // set initial colour
    updateFrame(); // start update routine
};

// start code here
addEventListener("resize", (event) => {
    clearInterval(updateInterval);
    // resize current canvas
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    // catching edge case of when a resize happens within the image
    checkHitBoxOnResize();
    // redraw to prevent flicker
    updateCanvas();
    // restart updating
    updateFrame();
});

main();
