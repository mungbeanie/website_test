let canvas;
let ctx;
let updateRate = 20; // ms
let updateInterval = null;
let logoColour;

const isBrowserMobile = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

let scale = isBrowserMobile() ? (0.15 / 4): 0.15;

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
