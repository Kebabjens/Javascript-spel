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
let fireCooldown = 125;

/*ctx.fillStyle = "blue";*/
ctx.drawImage(image, 580, 250, 65, 65)
/*ctx.fillRect(300, 300, 50, 50);*/

//ctx.drawImage(zombieImage, 300, 300, 50, 50)

let player = {   
  x: 580,
  y: 250,
  speed: 6
};

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


      player.x = Math.max(30, Math.min(canvas.width - 100, player.x));
      player.y = Math.max(20, Math.min(canvas.height - 80, player.y));   
    

      let projSpeed = 15;
      let currentTime = Date.now();
      
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

      

      for(let goli of projectileList){
        goli.Update();
      }
}

function Draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    /*ctx.fillStyle = "blue";*/
    ctx.drawImage(image, player.x, player.y, 65, 65)
    ctx.drawImage(zombieImage, 300, 300, 50, 50)

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