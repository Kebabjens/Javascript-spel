const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
if (!(ctx instanceof CanvasRenderingContext2D)) {
  throw new Error("canvas canvasar inte");
}

const image = document.getElementById("source");
const zombieImage = document.getElementById("zombie");
let projImage = new Image(2, 2);
projImage.src = "./bilder/steen.png";
let mobProjImage = new Image(2, 2);
mobProjImage.src = "./bilder/mobSteen.png";
let bossImage = new Image(2, 2);
bossImage.src = "./bilder/daidolos.png";
let healthBar1 = new Image(2, 2);
healthBar1.src = "./bilder/healthbar1.png";
let healthBar2 = new Image(2, 2);
healthBar2.src = "./bilder/healthbar2.png";
let powerupsImage = new Image(2, 2);
powerupsImage.src = "./bilder/powerupFrame.png";
let heartImg = new Image(2, 2);
heartImg.src = "./bilder/heart.png";
let speedImg = new Image(2, 2);
speedImg.src = "./bilder/speed.png";
let shotgunImg = new Image(2, 2);
shotgunImg.src = "./bilder/shotgun.png";
let attackspeedImg = new Image(2, 2);
attackspeedImg.src = "./bilder/attackspeed.png";
let penetrationImg = new Image(2, 2);
penetrationImg.src = "./bilder/penetration.png";
const d = new Date();
let ms = Date.now();
//console.log(window.innerHeight);
//console.log(window.innerWidth);
let lastFireTime = 0;
//let fireCooldown = 5;
let fireCooldown = 225;
let invincibleDuration = 0;
let bulletPenetration = false;
let bulletShotgun = false;

/*ctx.fillStyle = "blue";*/
ctx.drawImage(image, 580, 250, 65, 65);
/*ctx.fillRect(300, 300, 50, 50);*/
let difficulty = 1;
let score = 0;
let hp = 5;
let hearts = "";
let alive = true;
let numOfPowerUps = 0;

let dx = 0;
let dy = 0;
let AA = 0;

//ctx.drawImage(zombieImage, 300, 300, 50, 50)

class players {
  constructor(pos, speed, width, height) {
    this.pos = pos;
    this.speed = speed;
    this.width = width;
    this.height = height;

    this.frameIndex = 0;
    this.frameCount = 2;
    this.timePerFrame = 500;
    this.currentTime = ms;
    this.frames = [];

    for (let i = 0; i < this.frameCount; i++) {
      let frame = new Image();
      frame.src = `./bilder/Spelare/Idle/pixil-frame-${i}.png`;
      this.frames.push(frame);
    }

    this.PowerUpsActive = {
      speed: false,
      attackSpeed: false,
      penetration: false,
      shotgun: false,
    };
  }

  playerUpdate() {
    //Röreslse för spelaren
    if (keys["d"]) {
      player.pos[0] += player.speed;
    }
    if (keys["a"]) {
      player.pos[0] -= player.speed;
    }
    if (keys["s"]) {
      player.pos[1] += player.speed;
    }
    if (keys["w"]) {
      player.pos[1] -= player.speed;
    }
  }

  playerDraw() {
    if (player.currentTime + player.timePerFrame <= Date.now()) {
      player.frameIndex++;
      if (player.frameIndex >= player.frameCount) {
        player.frameIndex = 0;
      }
      player.currentTime = Date.now();
    }
    ctx.drawImage(player.frames[player.frameIndex], player.pos[0], player.pos[1], 65, 65);
  }
}

let player = new players([580, 300], 6, 65, 65);

let frameCountNormal = 10;
let framesNormal = [];

for (let i = 1; i <= frameCountNormal; i++) {
  let frame = new Image();
  frame.src = `./bilder/Zombie/Normal/Frame${i}.png`;
  framesNormal.push(frame);
}

let frameCountFast = 8;
let framesFast = [];

for (let i = 1; i <= frameCountFast; i++) {
  let frame = new Image();
  frame.src = `./bilder/Zombie/Fast/Frame${i}.png`;
  framesFast.push(frame);
}

//console.log(framesFast);
//console.log(framesNormal);
class Powerup {
  constructor(pos, type, duration) {
    this.pos = pos;
    this.type = type;
    this.duration = duration;

    this.height = 50;
    this.width = 50;
  }

  PowerupDraw() {
    ctx.drawImage(this.type, this.pos[0], this.pos[1], 50, 50);
  }
}

function ActtivePowerUpDraw() {
  numOfPowerUps = 0;
  if (player.PowerUpsActive.speed == true) {
    ctx.drawImage(powerupsImage, 20, 20, 60, 60);
    ctx.drawImage(speedImg, 30, 20, 45, 45);
    numOfPowerUps++;
  }
  if (player.PowerUpsActive.attackSpeed == true) {
    ctx.drawImage(powerupsImage, 20 + 70 * numOfPowerUps, 20, 60, 60);
    ctx.drawImage(attackspeedImg, 30 + 70 * numOfPowerUps, 30, 40, 40);
    numOfPowerUps++;
  }
  if (player.PowerUpsActive.penetration == true) {
    ctx.drawImage(powerupsImage, 20 + 70 * numOfPowerUps, 20, 60, 60);
    ctx.drawImage(penetrationImg, 30 + 70 * numOfPowerUps, 30, 40, 45);
    numOfPowerUps++;
  }
  if (player.PowerUpsActive.shotgun == true) {
    ctx.drawImage(powerupsImage, 20 + 70 * numOfPowerUps, 20, 60, 60);
    ctx.drawImage(shotgunImg, 30 + 70 * numOfPowerUps, 30, 40, 45);
    numOfPowerUps++;
  }
}

function PowerupUpdate() {
  if (powerUpList) {
    for (let i = powerUpList.length - 1; i >= 0; i--) {
      let power = powerUpList[i];
      if (powerUpList[i].duration <= 0) {
        powerUpList.splice(i, 1);
      } else {
        powerUpList[i].duration--;
      }
      if (power.pos[0] > player.pos[0] - 20 && power.pos[0] < player.pos[0] + player.width + 20 && power.pos[1] > player.pos[1] - 20 && power.pos[1] < player.pos[1] + player.height + 20) {
        PowerupApply(power.type);
        powerUpList.splice(i, 1);
      }
    }
  }
}
function PowerUpCheck(type) {
  let check = false;
  for (let i = activePowerUps.length - 1; i >= 0; i--) {
    let power = activePowerUps[i];
    if (power.type == type) {
      check = true;
    }
  }

  return check;
}

function ActivePowerUps() {
  player.PowerUpsActive = {
    speed: false,
    attackSpeed: false,
    penetration: false,
    shotgun: false,
  };

  for (let i = activePowerUps.length - 1; i >= 0; i--) {
    let power = activePowerUps[i];
    if (power.duration <= 0) {
      activePowerUps.splice(i, 1);
    } else {
      activePowerUps[i].duration--;
    }
    if (power.type == speedImg) {
      player.PowerUpsActive.speed = true;
    } else if (power.type == attackspeedImg) {
      player.PowerUpsActive.attackSpeed = true;
    } else if (power.type == penetrationImg) {
      player.PowerUpsActive.penetration = true;
    } else if (power.type == shotgunImg) {
      player.PowerUpsActive.shotgun = true;
    }
  }
}

function PowerupApply(type) {
  if (type == heartImg) {
    hp++;
  }
  if (type == speedImg) {
    activePowerUps.push(new Powerup(0, speedImg, 600));
  }
  if (type == attackspeedImg) {
    activePowerUps.push(new Powerup(0, attackspeedImg, 600));
  }
  if (type == penetrationImg) {
    activePowerUps.push(new Powerup(0, penetrationImg, 600));
  }
  if (type == shotgunImg) {
    activePowerUps.push(new Powerup(0, shotgunImg, 600));
  }
}

class Monsters {
  constructor(startPos, speed, width, height, img, hp) {
    this.pos = startPos;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.img = img;
    this.hp = hp;

    this.frameIndex = 1;

    this.timePerFrame = 100;
    this.currentTime = ms;

    this.targetPos = [0, 0];
    this.findTargetTime = 0;
    this.cooldown = 10;
  }

  mobDraw() {
    // Calculate the distance between the player and the monster
    let distanceX = this.pos[0] - player.pos[0];

    // Flip the image horizontally if the monster is on the right side of the player
    if (this.img == "Normal") {
      if (this.currentTime + this.timePerFrame <= Date.now()) {
        this.frameIndex++;
        if (this.frameIndex >= frameCountNormal) {
          this.frameIndex = 1;
        }
        this.currentTime = Date.now();
      }
      if (distanceX > 0) {
        ctx.save(); // Save the current canvas state
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(
          framesNormal[this.frameIndex],
          -this.pos[0] - this.width, // Adjust position after flipping
          this.pos[1],
          this.width,
          this.height
        );
        ctx.restore(); // Restore the canvas state to prevent flipping other objects
      } else {
        // Draw the monster normally if it's on the left side of the player
        ctx.drawImage(framesNormal[this.frameIndex], this.pos[0], this.pos[1], this.width, this.height);
      }
    } else if (this.img == "Fast") {
      if (this.currentTime + this.timePerFrame <= Date.now()) {
        this.frameIndex++;
        if (this.frameIndex >= frameCountFast) {
          this.frameIndex = 1;
        }
        this.currentTime = Date.now();
      }
      //console.log(framesNormal)
      if (distanceX > 0) {
        ctx.save(); // Save the current canvas state
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(
          framesFast[this.frameIndex],
          -this.pos[0] - this.width, // Adjust position after flipping
          this.pos[1],
          this.width,
          this.height
        );
        ctx.restore(); // Restore the canvas state to prevent flipping other objects
      } else {
        // Draw the monster normally if it's on the left side of the player
        ctx.drawImage(framesFast[this.frameIndex], this.pos[0], this.pos[1], this.width, this.height);
      }
    }
  }

  mobUpdate() {
    if (this.findTargetTime <= 0) {
      this.targetPos = [player.pos[0], player.pos[1]];
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

    for (let mob of monsterList) {
      if (mob !== this && this.mobCollide(mob)) {
        // Collision detected with another monster, adjust position
        if (this.pos[0] < mob.pos[0]) {
          this.pos[0] -= this.speed;
        } else {
          this.pos[0] += this.speed;
        }
        if (this.pos[1] < mob.pos[1]) {
          this.pos[1] -= this.speed;
        } else {
          this.pos[1] += this.speed;
        }
      }
    }

    this.findTargetTime--;
  }
  mobCollide(otherMob) {
    let overlap = 45;
    return this.pos[0] < otherMob.pos[0] + otherMob.width - overlap && this.pos[0] + this.width + overlap > otherMob.pos[0] && this.pos[1] < otherMob.pos[1] + otherMob.height - overlap && this.pos[1] + this.height > otherMob.pos[1] + overlap;
  }
}
class daidalos {
  constructor(pos, speed, height, width, hp) {
    this.pos = pos;
    this.speed = speed;
    this.height = height;
    this.width = width;
    this.hp = hp;

    this.targetPos = [0, 0];
    this.findTargetTime = 0;
    this.cooldown = 40;
  }

  bossDraw() {
    ctx.drawImage(bossImage, this.pos[0], this.pos[1], this.width, this.height);
  }

  bossUpdate() {
    if (this.findTargetTime <= 0) {
      this.targetPos = [player.pos[0] + player.width / 2, player.pos[1] + player.height / 2];
      this.findTargetTime = this.cooldown;
    }

    if (this.pos[0] + this.width / 2 < this.targetPos[0]) {
      this.pos[0] += this.speed;
    }
    if (this.targetPos[0] < this.pos[0] + this.width / 2) {
      this.pos[0] -= this.speed;
    }
    if (this.pos[1] + this.height / 2 < this.targetPos[1]) {
      this.pos[1] += this.speed;
    }
    if (this.targetPos[1] < this.pos[1] + this.height / 2) {
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

  ProjUpdate() {
    // Rörelse för stenar
    this.pos = [this.pos[0] + this.dir[0] * this.speed, this.pos[1] + this.dir[1] * this.speed];
  }

  ProjDraw() {
    ctx.drawImage(projImage, this.pos[0] + 20, this.pos[1] + 20);
  }
}
class Mobprojectile {
  constructor(startPos, dir, width, height, speed) {
    this.pos = startPos;
    this.dir = dir;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  MobProjUpdate() {
    // Rörelse för stenar
    this.pos = [this.pos[0] + this.dir[0] * this.speed, this.pos[1] + this.dir[1] * this.speed];
  }

  MobProjDraw() {
    ctx.drawImage(mobProjImage, this.pos[0] + 20, this.pos[1] + 20);
  }
}

let projectileList = [];
let mobProjectileList = [];
let monsterList = [];
let powerUpList = [];
let activePowerUps = [];
let t1 = 0;
let t2 = 0;
let t3 = 0;

monsterList.push(new Monsters([0, Math.random() * 50 + 170], 2, 55, 55, "Normal", 2));
monsterList.push(new Monsters([0, Math.random() * 50 + 170], 2, 55, 55, "Normal", 2));

let Daedalus;
function bossfight() {
  if (Daedalus == null) {
    Daedalus = new daidalos([300, -100], 0.6, 200, 200, 100);
  }
}

function phaseOne() {
  for (let a = -1; a <= 1; a++) {
    for (let b = -1; b <= 1; b++) {
      if (a != 0 || b != 0) {
        MobShoot(a, b);
      }
    }
  }
}
function phaseTwo() {
  monsterList.push(new Monsters([Daedalus.pos[0] + Daedalus.width / 2 + 20, Daedalus.pos[1] + Daedalus.height / 2], 1.5, 55, 55, "Normal", 2));
  monsterList.push(new Monsters([Daedalus.pos[0] + Daedalus.width / 2, Daedalus.pos[1] + Daedalus.height / 2], 1.5, 55, 55, "Normal", 2));
  monsterList.push(new Monsters([Daedalus.pos[0] + Daedalus.width / 2 - 20, Daedalus.pos[1] + Daedalus.height / 2], 2, 25, 45, "Fast", 2));
}
function phaseThree() {
  dx = player.pos[0] + player.width / 2 - Daedalus.pos[0] + Daedalus.width / 2 - 200;
  dy = player.pos[1] + player.height / 2 - Daedalus.pos[1] + Daedalus.height / 2 - 200;
  console.log(`dx: ${dx}, dy: ${dy}`);
  AA = Math.sqrt(dx ** 2 + dy ** 2);

  mobProjectileList.push(new Mobprojectile([Daedalus.pos[0] + Daedalus.width / 2, Daedalus.pos[1] + Daedalus.height / 2], [dx / AA, dy / AA], 25, 25, 10));
}

function mobSpawn() {
  if (monsterList.length == 0) {
    if (difficulty == 6) {
      bossfight();
      //bossList.push(new daidalos([300, 300], 4, 200, 200))
    }

    //else{
    if (Daedalus == null) {
      for (let a = 0; a < difficulty * 3; a++) {
        let rändöm = Math.floor(Math.random() * 4);
        //console.log(rändöm);
        switch (rändöm) {
          case 0:
            monsterList.push(new Monsters([0, canvas.height / 2 + Math.random() * 500 - 250], 1.5, 55, 55, "Normal", 2));
            break;
          case 1:
            monsterList.push(new Monsters([canvas.width / 2 + Math.random() * 500 - 250, 0], 1.5, 55, 55, "Normal", 2));
            break;
          case 2:
            monsterList.push(new Monsters([canvas.width, canvas.height / 2 + Math.random() * 500 - 250], 1.5, 55, 55, "Normal", 2));
            break;
          default:
            monsterList.push(new Monsters([canvas.width / 2 + Math.random() * 500 - 250, canvas.height], 1.5, 55, 55, "Normal", 2));
        }
      }
      if (difficulty > 3) {
        for (let a = 0; a < difficulty * 2; a++) {
          let rändöm = Math.floor(Math.random() * 4);
          //console.log(rändöm);
          switch (rändöm) {
            case 0:
              monsterList.push(new Monsters([0, canvas.height / 2 + Math.random() * 500 - 250], 2.5, 25, 45, "Fast", 1));
              break;
            case 1:
              monsterList.push(new Monsters([canvas.width / 2 + Math.random() * 500 - 250, 0], 2.5, 25, 45, "Fast", 1));
              break;
            case 2:
              monsterList.push(new Monsters([canvas.width, canvas.height / 2 + Math.random() * 500 - 250], 2.5, 25, 45, "Fast", 1));
              break;
            default:
              monsterList.push(new Monsters([canvas.width / 2 + Math.random() * 500 - 250, canvas.height], 2.5, 25, 45, "Fast", 1));
          }
        }
      }
      difficulty++;
    }

    //}
  }
}
function MobShoot(dirx, diry) {
  let projSpeed = 6;
  if (dirx == 0 || diry == 0) {
    mobProjectileList.push(new Mobprojectile([Daedalus.pos[0] + Daedalus.width / 2, Daedalus.pos[1] + Daedalus.height / 2], [dirx, diry], 25, 25, projSpeed));
  } else {
    mobProjectileList.push(new Mobprojectile([Daedalus.pos[0] + Daedalus.width / 2, Daedalus.pos[1] + Daedalus.height / 2], [dirx, diry], 25, 25, (Math.sqrt(2) / 2) * projSpeed));
  }
}
function shoot(dirx, diry) {
  let projSpeed = 15;

  //Attack

  if (dirx == 0 || diry == 0) {
    projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx, diry], projSpeed));
    if (bulletShotgun == true && diry == 0) {
      projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx, diry + 0.1], projSpeed / 1.05));
      projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx, diry - 0.1], projSpeed / 1.05));
    }
    if (bulletShotgun == true && dirx == 0) {
      projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx + 0.1, diry], projSpeed / 1.05));
      projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx - 0.1, diry], projSpeed / 1.05));
    }
  } else {
    projectileList.push(new projectile([player.pos[0], player.pos[1]], [dirx, diry], (Math.sqrt(2) / 2) * projSpeed));
  }
}

function Update() {
  if (alive == true) {
    requestAnimationFrame(Update);
  }
  mobSpawn();

  if (player.PowerUpsActive.speed == true) {
    player.speed = 9;
  } else {
    player.speed = 6;
  }

  if (player.PowerUpsActive.attackSpeed == true) {
    fireCooldown = 150;
  } else {
    fireCooldown = 225;
  }

  if (player.PowerUpsActive.penetration == true) {
    bulletPenetration = true;
  } else {
    bulletPenetration = false;
  }

  if (player.PowerUpsActive.shotgun == true) {
    bulletShotgun = true;
  } else {
    bulletShotgun = false;
  }

  //Se till att spelaren inte kan röra sig utanför spelplanen
  player.pos[0] = Math.max(30, Math.min(canvas.width - 100, player.pos[0]));
  player.pos[1] = Math.max(20, Math.min(canvas.height - 80, player.pos[1]));

  Monsters.speed = 3;
  Monsters.width = 55;
  Monsters.height = 55;
  let currentTime = Date.now();
  if (currentTime - lastFireTime > fireCooldown) {
    if (keys.ArrowRight && keys.ArrowDown) {
      shoot(1, 1);
      lastFireTime = currentTime;
    } else if (keys.ArrowRight && keys.ArrowUp) {
      shoot(1, -1);
      lastFireTime = currentTime;
    } else if (keys.ArrowRight) {
      shoot(1, 0);
      lastFireTime = currentTime;
    } else if (keys.ArrowLeft && keys.ArrowDown) {
      shoot(-1, 1);
      lastFireTime = currentTime;
    } else if (keys.ArrowLeft && keys.ArrowUp) {
      shoot(-1, -1);
      lastFireTime = currentTime;
    } else if (keys.ArrowLeft) {
      shoot(-1, 0);
      lastFireTime = currentTime;
    } else if (keys.ArrowDown) {
      shoot(0, 1);
      lastFireTime = currentTime;
    } else if (keys.ArrowUp) {
      shoot(0, -1);
      lastFireTime = currentTime;
    }
  }
  if (Daedalus != null) {
    if ((Daedalus.hp < 25 || (Daedalus.hp < 75 && Daedalus.hp > 50)) && t1 <= 0) {
      phaseOne();
      t1 = 90;
    }
    if (Daedalus.hp % 5 == 0 && t2 <= 0) {
      phaseTwo();
      t2 = 200;
    }
    if ((Daedalus.hp < 25 || (Daedalus.hp < 100 && Daedalus.hp > 75)) && t3 <= 0) {
      phaseThree();
      t3 = 20;
    }
    t1--;
    t2--;
    t3--;
    if (Daedalus.hp <= 0) {
      Daedalus = null;
      difficulty++;
    }
  }

  for (let i = mobProjectileList.length - 1; i >= 0; i--) {
    let boolet = mobProjectileList[i];

    boolet.MobProjUpdate();
    if (boolet.pos[0] < 0 || boolet.pos[0] > canvas.width || boolet.pos[1] < 0 || boolet.pos[1] > canvas.height) {
      mobProjectileList.splice(i, 1);
    }
  }
  //console.log(activePowerUps);

  for (let i = projectileList.length - 1; i >= 0; i--) {
    let boolet = projectileList[i];
    boolet.ProjUpdate();
    if (boolet.pos[0] < 0 || boolet.pos[0] > canvas.width || boolet.pos[1] < 0 || boolet.pos[1] > canvas.height) {
      projectileList.splice(i, 1);
    }
  }
  if (monsterList) {
    for (let mob of monsterList) {
      mob.mobUpdate();
    }
  }
  if (Daedalus != null) {
    Daedalus.bossUpdate();
  }
  if (powerUpList) {
    PowerupUpdate();
  }
  ActivePowerUps();

  player.playerUpdate();
  for (let i = projectileList.length - 1; i >= 0; i--) {
    for (let j = monsterList.length - 1; j >= 0; j--) {
      if (projectileList[i] && monsterList[j]) {
        let boolet = projectileList[i];
        let mob = monsterList[j];

        if (boolet.pos[0] > mob.pos[0] - 20 && boolet.pos[0] < mob.pos[0] + mob.width + 20 && boolet.pos[1] > mob.pos[1] - 20 && boolet.pos[1] < mob.pos[1] + mob.height + 20) {
          projectileList.splice(i, 1);
          mob.hp -= 1;
          if (mob.hp <= 0) {
            let rändöm = Math.floor(Math.random() * 50);
            switch (rändöm) {
              case 45:
                powerUpList.push(new Powerup(mob.pos, heartImg, 600));
                break;
              case 46:
                powerUpList.push(new Powerup(mob.pos, speedImg, 600));
                break;
              case 47:
                powerUpList.push(new Powerup(mob.pos, shotgunImg, 600));
                break;
              case 48:
                powerUpList.push(new Powerup(mob.pos, attackspeedImg, 600));
                break;
              case 49:
                powerUpList.push(new Powerup(mob.pos, penetrationImg, 600));
                break;
              default:
            }
            monsterList.splice(j, 1);
            score++;
          }
        }
      }
    }

    //console.log(monsterList)
  }
  for (let i = mobProjectileList.length - 1; i >= 0; i--) {
    if (mobProjectileList[i]) {
      let mobBoolet = mobProjectileList[i];
      if (mobBoolet.pos[0] > player.pos[0] - 30 && mobBoolet.pos[0] < player.pos[0] + player.width - 30 && mobBoolet.pos[1] > player.pos[1] - 30 && mobBoolet.pos[1] < player.pos[1] + player.height - 30) {
        hp -= 1;
        mobProjectileList.splice(i, 1);
      }
    }
  }
  for (let i = projectileList.length - 1; i >= 0; i--) {
    if (projectileList[i] && Daedalus != null) {
      let boolet = projectileList[i];
      if (boolet.pos[0] > Daedalus.pos[0] - 20 && boolet.pos[0] < Daedalus.pos[0] + Daedalus.width + 20 && boolet.pos[1] > Daedalus.pos[1] - 20 && boolet.pos[1] < Daedalus.pos[1] + Daedalus.height + 20) {
        Daedalus.hp -= 1;

        projectileList.splice(i, 1);
      }
    }
  }
  for (let j = monsterList.length - 1; j >= 0; j--) {
    let mob = monsterList[j];
    if (player.pos[0] > mob.pos[0] - 5 && player.pos[0] < mob.pos[0] + mob.width + 5 && player.pos[1] > mob.pos[1] - 5 && player.pos[1] < mob.pos[1] + mob.height + 5) {
      if (invincibleDuration < 0) {
        hp--;
        invincibleDuration = 50;
      }
    }
  }
  invincibleDuration--;
}

function Draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  for (let boolet of projectileList) {
    boolet.ProjDraw();
  }
  for (let ahmad of mobProjectileList) {
    ahmad.MobProjDraw();
  }
  for (let mob of monsterList) {
    mob.mobDraw();
  }
  if (Daedalus) {
    Daedalus.bossDraw();
  }
  for (let power of powerUpList) {
    power.PowerupDraw();
  }
  ActtivePowerUpDraw();

  player.playerDraw();
  ctx.font = "25px serif";
  ctx.fillStyle = "#aaaaaa";
  /*ctx.fillText("Score: " + score, 50, 60);*/
  ctx.fillStyle = "#ff0000";

  ctx.font = "50px Courier New";
  if (Daedalus != null) {
    ctx.drawImage(healthBar1, Daedalus.pos[0] + Daedalus.width / 2 - 192 / 2, Daedalus.pos[1] - 50, 196, 24);
    ctx.drawImage(healthBar2, Daedalus.pos[0] + Daedalus.width / 2 - 192 / 2 + 3, Daedalus.pos[1] - 47, 190 * (Daedalus.hp / 100), 18);
  }
  hearts = "";
  for (let i = 0; i < hp; i++) {
    d;
    hearts += "♥️";
  }
  ctx.fillText(hearts, canvas.width / 2 - hp * 13, 35);
  ctx.font = "100px";
  if (hp <= 0) {
    alive = false;
    ctx.fillText("You Died", 300, 300);
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
if (alive == false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
