let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
const image = document.getElementById("source");
const zombieImage = document.getElementById("zombie");
let projImage = new Image(2, 2);
projImage.src = "./bilder/steen.png";
/*let zombieImage = new Image(30,40);*/
//zombieImage = "./bilder/zombie.png";
const d = new Date();
let ms = Date.now();
console.log(window.innerHeight);
console.log(window.innerWidth);
let lastFireTime = 0;
let fireCooldown = 225;
let invincibleDuration = 0;


/*ctx.fillStyle = "blue";*/
ctx.drawImage(image, 580, 250, 65, 65);
/*ctx.fillRect(300, 300, 50, 50);*/

let score = 0;
let hp = 5;
let hearts = ""

//ctx.drawImage(zombieImage, 300, 300, 50, 50)

let player = {
  x: 580,
  y: 250,
  speed: 6,
};

class monsters {
  constructor(startPos, speed, width, height) {
    this.pos = startPos;
    this.speed = speed;
    this.width = width;
    this.height = height;

    this.targetPos = [0, 0];
    this.findTargetTime = 0;
    this.cooldown = 10;
  }

  mobDraw() {
    ctx.drawImage(
      zombieImage,
      this.pos[0],
      this.pos[1],
      this.width,
      this.height
    );
  }

  mobUpdate() {
    if (this.findTargetTime <= 0) {
      this.targetPos = [player.x, player.y];
      this.findTargetTime = this.cooldown;
    }

    if (this.pos[0] < this.targetPos[0]) {
      this.pos[0] += this.speed;
    }
    if (this.targetPos[0] < this.pos[0]) {
      this.pos[0] -= this.speed;
    }
    if (this.pos[1] < this.targetPos[1]) {
      this.pos[1] += this.speed;
    }
    if (this.targetPos[1] < this.pos[1]) {
      this.pos[1] -= this.speed;
    }

    this.findTargetTime--;
  }
}

class projectile {
  constructor(startPos, dir, speed) {
    this.pos = startPos;
    this.dir = dir;
    this.speed = speed;
  }

  Update() {
    // Rörelse för stenar
    this.pos = [
      this.pos[0] + this.dir[0] * this.speed,
      this.pos[1] + this.dir[1] * this.speed,
    ];
  }

  Draw() {
    ctx.drawImage(projImage, this.pos[0] + 20, this.pos[1] + 20);
  }
}

let projectileList = [];
let monsterList = [];

monsterList.push(new monsters([0, Math.random() * 50 + 170], 2, 55, 55));
monsterList.push(new monsters([0, Math.random() * 50 + 170], 2, 55, 55));
monsterList.push(new monsters([0, Math.random() * 50 + 170], 2, 55, 55));
monsterList.push(new monsters([0, Math.random() * 50 + 170], 2, 55, 55));

function Update() {
  requestAnimationFrame(Update);
  //Röreslse för spelaren
  if (keys["d"]) {
    player.x += player.speed;
  }
  if (keys["a"]) {
    player.x -= player.speed;
  }
  if (keys["s"]) {
    player.y += player.speed;
  }
  if (keys["w"]) {
    player.y -= player.speed;
  }

  //Se till att spelaren inte kan röra sig utanför spelplanen
  player.x = Math.max(30, Math.min(canvas.width - 100, player.x));
  player.y = Math.max(20, Math.min(canvas.height - 80, player.y));

  monsters.speed = 3;
  monsters.width = 55;
  monsters.height = 55;
  let projSpeed = 15;
  let currentTime = Date.now();

  //Attack
  if (
    keys.ArrowRight &&
    keys.ArrowDown &&
    currentTime - lastFireTime > fireCooldown
  ) {
    projectileList.push(
      new projectile(
        [player.x, player.y],
        [1, 1],
        (Math.sqrt(2) / 2) * projSpeed
      )
    );
    lastFireTime = currentTime;
  } else if (
    keys.ArrowRight &&
    keys.ArrowUp &&
    currentTime - lastFireTime > fireCooldown
  ) {
    projectileList.push(
      new projectile(
        [player.x, player.y],
        [1, -1],
        (Math.sqrt(2) / 2) * projSpeed
      )
    );
    lastFireTime = currentTime;
  } else if (keys.ArrowRight && currentTime - lastFireTime > fireCooldown) {
    projectileList.push(
      new projectile([player.x, player.y], [1, 0], projSpeed)
    );
    lastFireTime = currentTime;
  }
  if (
    keys.ArrowLeft &&
    keys.ArrowDown &&
    currentTime - lastFireTime > fireCooldown
  ) {
    projectileList.push(
      new projectile(
        [player.x, player.y],
        [-1, 1],
        (Math.sqrt(2) / 2) * projSpeed
      )
    );
    lastFireTime = currentTime;
  } else if (
    keys.ArrowLeft &&
    keys.ArrowUp &&
    currentTime - lastFireTime > fireCooldown
  ) {
    projectileList.push(
      new projectile(
        [player.x, player.y],
        [-1, -1],
        (Math.sqrt(2) / 2) * projSpeed
      )
    );
    lastFireTime = currentTime;
  } else if (keys.ArrowLeft && currentTime - lastFireTime > fireCooldown) {
    projectileList.push(
      new projectile([player.x, player.y], [-1, 0], projSpeed)
    );
    lastFireTime = currentTime;
  }
  if (keys.ArrowDown && currentTime - lastFireTime > fireCooldown) {
    projectileList.push(
      new projectile([player.x, player.y], [0, 1], projSpeed)
    );
    lastFireTime = currentTime;
  }
  if (keys.ArrowUp && currentTime - lastFireTime > fireCooldown) {
    projectileList.push(
      new projectile([player.x, player.y], [0, -1], projSpeed)
    );
    lastFireTime = currentTime;
  }

  for (let i = projectileList.length - 1; i >= 0; i--) {
    let boolet = projectileList[i];
    boolet.Update();
    if (
      boolet.pos[0] < 0 ||
      boolet.pos[0] > canvas.width ||
      boolet.pos[1] < 0 ||
      boolet.pos[1] > canvas.height
    ) {
      projectileList.splice(i, 1);
    }
  }

  for (let mob of monsterList) {
    mob.mobUpdate();
  }
  for (let i = projectileList.length - 1; i >= 0; i--) {
    for (let j = monsterList.length - 1; j >= 0; j--) {
      let boolet = projectileList[i];
      let mob = monsterList[j];

      if (
        boolet.pos[0] > mob.pos[0] - 20 &&
        boolet.pos[0] < mob.pos[0] + mob.width + 20 &&
        boolet.pos[1] > mob.pos[1] - 20 &&
        boolet.pos[1] < mob.pos[1] + mob.height + 20
      ) {
        projectileList.splice(i, 1);
        monsterList.splice(j, 1);
        //monster.x = Math.random() * window.innerWidth
        //monster.y = Math.random() * window.innerHeight

        let rändöm = Math.floor(Math.random() * 4);
        console.log(rändöm);
        switch (rändöm) {
          case 0:
            monsterList.push(new monsters([0, canvas.height / 2], 2, 55, 55));
            monsterList.push(new monsters([0, canvas.height / 2], 2, 55, 55));
            break;
          case 1:
            monsterList.push(new monsters([canvas.width / 2, 0], 2, 55, 55));
            monsterList.push(new monsters([0, canvas.height / 2], 2, 55, 55));
            break;
          case 2:
            monsterList.push(
              new monsters([canvas.width, canvas.height / 2], 2, 55, 55)
              
            );
            monsterList.push(new monsters([0, canvas.height / 2], 2, 55, 55));
            break;
          default:
            monsterList.push(
              new monsters([canvas.width / 2, canvas.height], 2, 55, 55)
            );
            monsterList.push(new monsters([0, canvas.height / 2], 2, 55, 55));
        }

        score++;
      }
    }

    //console.log(monsterList)
  }
  for (let j = monsterList.length - 1; j >= 0; j--) {
    let mob = monsterList[j]
    if (
      player.x > mob.pos[0] - 5 &&
      player.x < mob.pos[0] + mob.width + 5 &&
      player.y > mob.pos[1] - 5 &&
      player.y < mob.pos[1] + mob.height + 5
    ) {
      if(invincibleDuration < 0){
        hp --
        invincibleDuration = 50
      }
      
    }
  }
  invincibleDuration --
}

function Draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;
  /*ctx.fillStyle = "blue";*/
  ctx.drawImage(image, player.x, player.y, 65, 65);
  //ctx.drawImage(zombieImage, monster.x, monster.y, monster.width, monster.height)

  for (let boolet of projectileList) {
    boolet.Draw();
  }
  for (let mob of monsterList) {
    mob.mobDraw();
  }
  /*ctx.fillRect(300, 300, 50, 50);*/
  ctx.font = "25px serif";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText("Score: " + score, 50, 60);
  ctx.fillStyle = "#ff0000"
  ctx.font = "50px Courier New";

  hearts = ""
  for (let i = 0; i<hp; i++){
    hearts += "♥️";
  }
  ctx.fillText(hearts, (canvas.width)/2 - hp * 13, 35);
  ctx.font = "100px"
  if (hp == 0){
    ctx.fillText("You Died", 300, 300 )
  }
  requestAnimationFrame(Draw);
}
function gameLoop() {
  Update();
  Draw();
}

const keys = {};
window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

gameLoop();
