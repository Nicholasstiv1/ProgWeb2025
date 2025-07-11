import { space } from "./space.js"

class Shot {
  constructor(x, y) {
    this.element = document.createElement("img")
    this.element.className = "shot"
    this.element.src = "./assets/png/laserRed.png"
    
    this.element.style.position = "absolute"
    
    this.element.style.left = `${x + 48}px`
    this.element.style.bottom = `${y}px`
    
    this.speed = 8
    
    space.element.appendChild(this.element)
  }
  
  move() {
    const currentBottom = parseInt(this.element.style.bottom)
    this.element.style.bottom = `${currentBottom + this.speed}px`
  }
  
  isOutOfScreen() {
    const spaceHeight = space.element.offsetHeight
    const shotBottom = parseInt(this.element.style.bottom)
    return shotBottom > spaceHeight
  }
  
  checkCollision(obstacle) {
    const shotRect = this.element.getBoundingClientRect()
    
    const obstacleRect = obstacle.element.getBoundingClientRect()
    
    return !(
      shotRect.right < obstacleRect.left ||
      shotRect.left > obstacleRect.right ||
      shotRect.bottom < obstacleRect.top ||
      shotRect.top > obstacleRect.bottom
    )
  }
  
  remove() {
    this.element.remove()
  }
}

const shots = []

export function createShot(x, y) {
  const shot = new Shot(x, y)
  shots.push(shot)
}

export function moveShots() {
  for (let i = shots.length - 1; i >= 0; i--) {
    const shot = shots[i]
    shot.move()
    
    const obstacles = window.gameObstacles || []
    for (let j = obstacles.length - 1; j >= 0; j--) {
      const obstacle = obstacles[j]
      
      if (shot.checkCollision(obstacle)) {
        let points = 0
        switch (obstacle.type) {
          case "meteorBig":
            points = 10;
            break;
          case "enemyUFO":
            points = 20;
            break;
          case "meteorSmall":
            points = 100;
            break;
        }
        
        const scoreEvent = new CustomEvent('score', { 
          detail: { points: points } 
        });
        document.dispatchEvent(scoreEvent);
        
        createExplosion(obstacle.element);
        
        obstacle.remove()
        obstacles.splice(j, 1)
        shot.remove()
        shots.splice(i, 1)
        
        break
      }
    }
    
    const enemyShips = window.gameEnemyShips || []
    for (let j = enemyShips.length - 1; j >= 0; j--) {
      const enemyShip = enemyShips[j]
      
      if (shot.checkCollision(enemyShip)) {
        const scoreEvent = new CustomEvent('score', { 
          detail: { points: 50 } 
        });
        document.dispatchEvent(scoreEvent);
        
        createExplosion(enemyShip.element);
        
        enemyShip.remove()
        enemyShips.splice(j, 1)
        shot.remove()
        shots.splice(i, 1)
        
        break
      }
    }
    
    if (i < shots.length && shot.isOutOfScreen()) {
      shot.remove()
      shots.splice(i, 1)
    }
  }
}

function createExplosion(targetElement) {
  const explosion = document.createElement("img");
  explosion.className = "explosion";
  explosion.src = "./assets/png/laserRedShot.png"; 
  
  const rect = targetElement.getBoundingClientRect();
  const spaceRect = space.element.getBoundingClientRect();
  
  explosion.style.position = "absolute";
  explosion.style.left = `${rect.left - spaceRect.left + rect.width/2 - 25}px`;
  explosion.style.top = `${rect.top - spaceRect.top + rect.height/2 - 25}px`;
  explosion.style.zIndex = "100";
  
  space.element.appendChild(explosion);
  
  setTimeout(() => {
    explosion.remove();
  }, 500);
}