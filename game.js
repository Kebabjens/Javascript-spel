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
console.log(window.innerHeight)
console.log(window.innerWidth)
let lastFireTime = 0;
let fireCooldown = 225;

/*ctx.fillStyle = "blue";*/
ctx.drawImage(image, 580, 250, 65, 65)
/*ctx.fillRect(300, 300, 50, 50);*/

let score = 0


//ctx.drawImage(zombieImage, 300, 300, 50, 50)

let player = {   
  x: 580,
  y: 250,
  speed: 6
};
let monster = {
  x: 300,
  y: 300,
  width: 55,
  height: 55,
  speed: 3
}

class projectile{
  constructor(startPos, dir, speed){
    this.pos = startPos;
    this.dir = dir;
    this.speed = speed;
  }

  Update(){
    
    this.pos = [this.pos[0] + this.dir[0] * this.speed, this.pos[1] + this.dir[1] * this.speed];
    
  }
  Draw(){
    
    ctx.drawImage(projImage, this.pos[0]+20, this.pos[1]+20);
    
  }
  
  
}

let projectileList = [];

function Update(){
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

      // Röresle för monstret
      if (monster.x < player.x){
        monster.x += monster.speed;
      }
      if (player.x < monster.x){
        monster.x -= monster.speed;
      }
      if (monster.y < player.y){
        monster.y += monster.speed;
      }
      if (player.y < monster.y){
        monster.y -= monster.speed;
      }

      //Se till att spelaren inte kan röra sig utanför spelplanen
      player.x = Math.max(30, Math.min(canvas.width - 100, player.x));
      player.y = Math.max(20, Math.min(canvas.height - 80, player.y));   
    

      let projSpeed = 15;
      let currentTime = Date.now();
      
      //Attack
      if (keys.ArrowRight && keys.ArrowDown && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [1, 1], (Math.sqrt(2)/2) * projSpeed));
        lastFireTime = currentTime;
      }
      else if (keys.ArrowRight && keys.ArrowUp && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [1, -1],(Math.sqrt(2)/2) * projSpeed));
        lastFireTime = currentTime;
      } else if (keys.ArrowRight && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [1, 0], projSpeed));
        lastFireTime = currentTime;
      }
      if (keys.ArrowLeft && keys.ArrowDown && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [-1, 1],(Math.sqrt(2)/2) * projSpeed));
        lastFireTime = currentTime;
      }
      else if (keys.ArrowLeft && keys.ArrowUp && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [-1, -1],(Math.sqrt(2)/2) * projSpeed));
        lastFireTime = currentTime;
      } else if (keys.ArrowLeft && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [-1, 0], projSpeed));
        lastFireTime = currentTime;
      }
      if (keys.ArrowDown && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [0, 1], projSpeed));
        lastFireTime = currentTime;      
      }
      if (keys.ArrowUp && currentTime - lastFireTime > fireCooldown) {
        projectileList.push(new projectile([player.x, player.y], [0, -1], projSpeed));
        lastFireTime = currentTime;      
      }

      
      for (let i = projectileList.length - 1; i >= 0; i--) {
        let goli = projectileList[i];
        if (goli.pos[0] < 0 ||  goli.pos[0] > window.innerWidth || goli.pos[1] < 0 || goli.pos[1] > window.innerHeight) {
            projectileList.splice(i, 1);
        }
        if (goli.pos[0] > monster.x -20 && goli.pos[0] < monster.x + monster.width + 20 && goli.pos[1] > monster.y - 20 && goli.pos[1] < monster.y + monster.height + 20){
            projectileList.splice(i, 1);
            monster.x = Math.random() * window.innerWidth
            monster.y = Math.random() * window.innerHeight  
            score ++
        }
        goli.Update();
    
        console.log(projectileList)
      }
}

function Draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    /*ctx.fillStyle = "blue";*/
    ctx.drawImage(image, player.x, player.y, 65, 65)
    ctx.drawImage(zombieImage, monster.x, monster.y, monster.width, monster.height)
    ctx.font = "50px serif"
    ctx.fillText("Score: " + score, 100, 100)

    for(let goli of projectileList){
      goli.Draw();
    }
    /*ctx.fillRect(300, 300, 50, 50);*/

    requestAnimationFrame(Draw);    
}
function gameLoop(){
    Update();
    Draw();
}

const keys = {};
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});
window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

gameLoop();