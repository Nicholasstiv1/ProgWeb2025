import { space } from "./space.js"

export class Obstacle {
  constructor(type, speed, x) {
    this.type = type
    this.speed = speed
    this.element = document.createElement("img")
    this.element.classList.add("obstacle")

    if (type === "enemyUFO") {
      this.element.src = "assets/png/enemyUFO.png"
    } else if (type === "meteorBig") {
      this.element.src = "assets/png/meteorBig.png"
    } else if (type === "meteorSmall") {
      this.element.src = "assets/png/meteorSmall.png"
    }

    this.element.style.position = "absolute"
    this.element.style.top = "0px"
    this.element.style.left = `${x}px`

    space.element.appendChild(this.element)
  }

  move() {
    const currentY = parseInt(this.element.style.top)
    this.element.style.top = `${currentY + this.speed}px`
  }

  isOutOfScreen(tamy) {
    return parseInt(this.element.style.top) > tamy
  }

  remove() {
    this.element.remove()
  }
}