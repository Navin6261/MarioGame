// importing the images

import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";

const canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

// setting the size of the window

canvas.width = 1024;
canvas.height = 576;

//adding the gravity so it may loook realistic

const gravity = 0.5;

// defining the player and its properties

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 10,
    };
    this.width = 30;
    this.height = 30;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  // using the update function to update the velocity and position of the player
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

// defining the platform amd its properties

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// genericObject class is for the remaining photos other than platform 

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// this function createImage takes the source of the image and return the image based on it.

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}


let platformImage = createImage(platform);

let player = new Player();

let platforms = [
  new Platform({ x: platformImage.width * 4 + 110, y: 370, image: createImage(platformSmallTall)}),
  new Platform({ x: -1, y: 470, image: platformImage }),
  new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
  new Platform({ x: platformImage.width * 2 + 100,  y: 470,  image: platformImage}),
  new Platform({ x: platformImage.width * 3 + 400,  y: 470,  image: platformImage}),
];

let genericObjects = [
  new GenericObject({ x: -1, y: -1, image: createImage(background) }),
  new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffSet = 0;

// lose condition function init 

function init(){

 platformImage = createImage(platform);
 player = new Player();

 platforms = [
  new Platform({ x: platformImage.width * 4 + 110, y: 370, image: createImage(platformSmallTall)}),
  new Platform({ x: -1, y: 470, image: platformImage }),
  new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
  new Platform({ x: platformImage.width * 2 + 100,  y: 470,  image: platformImage}),
  new Platform({ x: platformImage.width * 3 + 400,  y: 470,  image: platformImage}),
];

 genericObjects = [
  new GenericObject({ x: -1, y: -1, image: createImage(background) }),
  new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
];

 scrollOffSet = 0;

}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 10;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -10;
  } else {
    player.velocity.x = 0;

    // moving the platform

    if (keys.right.pressed) {
      scrollOffSet += 10;

      platforms.forEach((platform) => {
        platform.position.x -= 10;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 6.6;
      });

    } else if (keys.left.pressed) {
      scrollOffSet -= 10;

      platforms.forEach((platform) => {
        platform.position.x += 10;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 6.6;
      });

    }
  }

  // rectangular collision detection
  platforms.forEach((platform) => {
    if ( player.position.y + player.height <= platform.position.y &&
         player.position.y + player.height + player.velocity.y >= platform.position.y &&
         player.position.x + player.width >= platform.position.x &&
         player.position.x <= platform.position.x + platform.width) 
    {
      player.velocity.y = 0;
    }
  });

  // win condition
  if (scrollOffSet > 2000) {
    console.log("you won");
  }

  // lose condition
  if (player.position.y > canvas.height) {
    init()
  }
}

animate();

// adding eventListeners so that we may get the output based on the key pressed.

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 87:
      console.log("up");
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 87:
      console.log("up");
      break;
  }
});
