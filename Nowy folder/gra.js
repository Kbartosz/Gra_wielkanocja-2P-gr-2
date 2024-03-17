const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const screenX = canvas.width;
const screenY = canvas.height;

let Points = 0;
let Frame = 0;
let Lives = 3; // Dodane liczba żyć
let startTime = 0; // Dodane - czas rozpoczęcia gry
let elapsedTime = 0; // Dodane - upływający czas
let timerInterval; // Dodane - interwał licznika czasu

const gravity = 1.5;

function randomNumber(min, max) {
  return (
    (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) %
      (max - min + 1)) +
    min
  );
}

class Sprite {
  constructor({ position, velocity, width, height, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.isGrounded = false;
    this.color = color;
  }
  draw() {
    let playerImage = new Image();
    playerImage.src = this.color;
    ctx.drawImage(playerImage, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
    } else this.velocity.y = gravity;
    if (this.position.x > screenX) this.position.x = 0 - this.width;
    if (this.position.x < 0 - this.width) this.position.x = screenX;
  }
}

const player = new Sprite({
  position: {
    x: screenX / 2,
    y: screenY - 100 * 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: 41 * 2,
  height: 92 * 2,
  color: "pixil-frame-01.png",
});

function AddCarrot() {
  return new Sprite({
    position: {
      x: randomNumber(0, screenX - 50),
      y: 0 + 50,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    width: 30 * 2,
    height: 30 * 2,
    color: "pixil-frame-0.png",
  });
}

let carrots = [AddCarrot()];

function isCollide(a, b) {
  return !(
    a.position.y + a.height < b.position.y ||
    a.position.y > b.position.y + b.height ||
    a.position.x + a.width < b.position.x ||
    a.position.x > b.position.x + b.width
  );
}

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  q: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  y: { pressed: false },
};

let back = new Image();
back.onload = function () {
  ctx.drawImage(back, 0, 0, screenX, screenY);
};
back.src = "back.png";

let paused = false;

function animate() {
  Frame += 1;
  window.requestAnimationFrame(animate);

  // Rozpoczęcie liczenia czasu po pierwszym wywołaniu funkcji animate
  if (Frame === 1) {
    startTime = Date.now();
    timerInterval = setInterval(updateTime, 1000);
  }

  ctx.clearRect(0, 0, screenX, screenY);

  // Rysowanie tła
  ctx.drawImage(back, 0, 0, screenX, screenY);

  if (Lives > 0 || paused) {
    player.update();
    player.velocity.y = 0;
    player.velocity.x = 0;

    //player movment
    if (keys.a.pressed) {
      player.velocity.x = -5;
    } else if (keys.d.pressed) {
      player.velocity.x = 5;
    }

    if (Frame > 100 - Points / 10) {
      carrots.push(AddCarrot());
      Frame = 0;
    }
    carrots.forEach(function (carrot, index, object) {
      carrot.update();
      if (carrot.position.x >= screenX - carrot.width) {
        carrot.markedForDeletion = 1;
      }
      if (isCollide(player, carrot)) {
        carrot.markedForDeletion = 1;
        Points++;
      }
      if (carrot.position.y + carrot.height > screenY) {
        carrot.markedForDeletion = 1;
        Lives -= 1;
      }
    });

    for (let i = 0; i < carrots.length; i++) {
      if (carrots[i].markedForDeletion) {
        carrots.splice(i, 1);
      }
    }

    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(`${Points}`, player.position.x + player.width / 2, player.position.y);

    // Dodanie wyświetlania żyć
    ctx.fillStyle = "blue";
    ctx.fillText(`Życia: ${Lives}`, screenX / 2, 50);
   
    // Wyświetlanie czasu
    
   
  }
  // Aktualizacja czasu
  else{
    ctx.fillStyle = "red";
    ctx.fillText("YOU LOST ",screenX/2-20,screenY/2-50)
  }
}


window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "o":
      carrots.push(AddCarrot());
      break;
    case "y":
      keys.y.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "y":
      keys.y.pressed = false;
      break;
  }
});

animate();
