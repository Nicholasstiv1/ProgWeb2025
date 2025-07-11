import { TAMX, PROB_ENEMY_SHIP, PROB_ENEMY_SHOT } from "./config.js"
import { space } from "./space.js"
import { createEnemyShot } from "./enemyShot.js"

const enemyShips = []

function isOverlappingEnemyShips(newX, newWidth = 40) {
  for (const ship of enemyShips) {
    const existingX = parseInt(ship.element.style.left)
    const existingWidth = ship.element.offsetWidth || 40
    const dx = Math.abs(existingX - newX)
    if (dx < (existingWidth + newWidth) / 1.5) {
      return true
    }
  }
  return false
}

function isOverlappingObstacles(newX, newWidth = 40) {
  const obstacles = window.gameObstacles || []

  for (const obs of obstacles) {
    const existingX = parseInt(obs.element.style.left)
    const existingWidth = obs.element.offsetWidth || 50
    const dx = Math.abs(existingX - newX)
    if (dx < (existingWidth + newWidth) / 1.5) {
      return true
    }
  }
  return false
}

class EnemyShip {
  constructor() {
    this.element = document.createElement("img")
    this.element.className = "enemy-ship"
    this.element.src = "assets/png/enemyShip.png"
    this.element.style.top = "-20px"

    let x
    let attempts = 5
    const width = 40

    do {
      x = parseInt(Math.random() * (TAMX - width))
      attempts--
    } while ((isOverlappingEnemyShips(x, width) || isOverlappingObstacles(x, width)) && attempts > 0)

    if (attempts <= 0) {
      this.invalid = true
      return
    }

    this.element.style.left = `${x}px`
    space.element.appendChild(this.element)

    this.lastShotTime = Date.now()
    this.shotCooldown = 1000 + Math.random() * 3000
  }

  move() {
    const currentY = parseInt(this.element.style.top)
    this.element.style.top = `${currentY + 1}px`

    this.tryShoot()
  }

  tryShoot() {
    const now = Date.now()
    if (now - this.lastShotTime > this.shotCooldown) {
      if (Math.random() < PROB_ENEMY_SHOT) {
        this.shoot()
        this.lastShotTime = now
        this.shotCooldown = 1000 + Math.random() * 3000
      }
    }
  }

  shoot() {
    const shipX = parseInt(this.element.style.left)
    const shipY = parseInt(this.element.style.top) + this.element.offsetHeight
    createEnemyShot(shipX, shipY)
  }

  isOutOfScreen(tamy) {
    return parseInt(this.element.style.top) > tamy
  }

  remove() {
    this.element.remove()
  }
}

export const createRandomEnemyShip = () => {
  if (Math.random() < PROB_ENEMY_SHIP) {
    const ship = new EnemyShip()
    if (!ship.invalid) {
      enemyShips.push(ship)
    }
  }
}

export const moveEnemyShips = () => {
  for (let i = enemyShips.length - 1; i >= 0; i--) {
    enemyShips[i].move()

    if (enemyShips[i].isOutOfScreen(space.element.offsetHeight)) {
      enemyShips[i].remove()
      enemyShips.splice(i, 1)
    }
  }
}

export const getEnemyShips = () => enemyShips;