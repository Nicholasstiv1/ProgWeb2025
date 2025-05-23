import { space } from "./space.js"
import { ship } from "./ship.js"

class EnemyShot {
  constructor(x, y) {
    this.element = document.createElement("img")
    this.element.className = "enemy-shot"
    this.element.src = "./assets/png/laserGreen.png"
    
    this.element.style.position = "absolute"
    
    this.element.style.left = `${x + 20}px` 
    this.element.style.top = `${y}px`
    
    this.speed = 5
    
    space.element.appendChild(this.element)
  }
  
  move() {
    const currentTop = parseInt(this.element.style.top)
    this.element.style.top = `${currentTop + this.speed}px`
  }
  
  isOutOfScreen(tamy) {
    return parseInt(this.element.style.top) > tamy
  }
  
  checkCollisionWithPlayer() {
    const shotRect = this.element.getBoundingClientRect()
    
    const playerRect = ship.element.getBoundingClientRect()
    
    return !(
      shotRect.right < playerRect.left ||
      shotRect.left > playerRect.right ||
      shotRect.bottom < playerRect.top ||
      shotRect.top > playerRect.bottom
    )
  }
  
  remove() {
    this.element.remove()
  }
}

const enemyShots = []

export function createEnemyShot(x, y) {
  const shot = new EnemyShot(x, y)
  enemyShots.push(shot)
}

export function moveEnemyShots() {
  const spaceHeight = space.element.offsetHeight
  
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const shot = enemyShots[i]
    shot.move()
    
    if (shot.checkCollisionWithPlayer()) {
      const damageEvent = new CustomEvent('damage', { 
        detail: { lives: 1 } 
      });
      document.dispatchEvent(damageEvent);
      
      createPlayerExplosion();
      
      shot.remove()
      enemyShots.splice(i, 1)
      continue
    }
    
    if (shot.isOutOfScreen(spaceHeight)) {
      shot.remove()
      enemyShots.splice(i, 1)
    }
  }
}

function createPlayerExplosion() {
  const explosion = document.createElement("img");
  explosion.className = "explosion";
  explosion.src = "./assets/png/laserGreenShot.png"; 
  
  const rect = ship.element.getBoundingClientRect();
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