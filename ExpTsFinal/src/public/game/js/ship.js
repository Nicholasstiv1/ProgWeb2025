import { TAMX } from "./config.js"
import { space } from "./space.js"
import { createShot } from "./shot.js"

const directions = [
  "assets/png/playerLeft.png",
  "assets/png/player.png",
  "assets/png/playerRight.png",
]

const damagedDirections = "assets/png/playerDamaged.png"

class Ship {
  constructor() {
    this.element = document.createElement("img")
    this.element.id = "ship"
    this.direction = 1
    this.element.src = directions[this.direction]
    this.element.style.position = "absolute"
    this.element.style.bottom = "20px"
    this.element.style.left = `${TAMX / 2 - 50}px`
    space.element.appendChild(this.element)

    this.width = 100
    this.speed = 3

    this.keys = {
      left: false,
      right: false
    }

    this.lastShotTime = 0
    this.shotCooldown = 300

    this.invulnerable = false
    this.isDamaged = false
    this.damageTimeout = null

    this.initKeyboardHandlers()
  }

  initKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.keys.left = true
        e.preventDefault()
      }
      if (e.key === 'ArrowRight') {
        this.keys.right = true
        e.preventDefault()
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') {
        this.keys.left = false
        e.preventDefault()
      }
      if (e.key === 'ArrowRight') {
        this.keys.right = false
        e.preventDefault()
      }
    })

    window.addEventListener('blur', () => {
      this.keys.left = false
      this.keys.right = false
    })

    document.addEventListener('contextmenu', (e) => {
      this.keys.left = false
      this.keys.right = false
    })
  }

  shoot() {
    const now = Date.now()
    if (now - this.lastShotTime >= this.shotCooldown) {
      const shipX = parseInt(this.element.style.left)
      const shipY = parseInt(this.element.style.bottom)
      createShot(shipX, shipY)

      this.lastShotTime = now
    }
  }

  takeDamage() {
    if (this.invulnerable) return false

    this.invulnerable = true
    this.isDamaged = true

    if (this.damageTimeout) {
      clearTimeout(this.damageTimeout)
    }

    this.updateSprite()

    this.startBlinkingEffect()

    this.damageTimeout = setTimeout(() => {
      this.isDamaged = false
      this.invulnerable = false
      this.stopBlinkingEffect()
      this.updateSprite()
    }, 2000)

    return true
  }

  updateSprite() {
    if (this.isDamaged) {
      this.element.src = damagedDirections
    } else {
      if (this.keys.left && !this.keys.right) {
        this.direction = 0
      } else if (this.keys.right && !this.keys.left) {
        this.direction = 2
      } else {
        this.direction = 1
      }
      this.element.src = directions[this.direction]
    }
  }

  startBlinkingEffect() {
    this.element.style.animation = "blink 0.3s infinite"
  }

  stopBlinkingEffect() {
    this.element.style.animation = ""
    this.element.style.opacity = "1"
  }

  move() {
    const currentX = parseInt(this.element.style.left)
    let newX = currentX

    if (this.keys.left && !this.keys.right) {
      newX = Math.max(currentX - this.speed, 0)
    } else if (this.keys.right && !this.keys.left) {
      const maxX = TAMX - this.width
      newX = Math.min(currentX + this.speed, maxX)
    }

    if (newX !== currentX) {
      this.element.style.left = `${newX}px`
    }

    this.updateSprite()
  }

  cleanup() {
    if (this.damageTimeout) {
      clearTimeout(this.damageTimeout)
      this.damageTimeout = null
    }
    this.stopBlinkingEffect()

    this.keys.left = false
    this.keys.right = false
  }
}

export const ship = new Ship()