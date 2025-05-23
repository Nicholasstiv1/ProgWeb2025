import { TAMX, TAMY } from "./config.js"

class Space {
  constructor() {
    this.element = document.getElementById("space")
    this.element.style.width = `${TAMX}px`
    this.element.style.height = `${TAMY}px`
    this.element.style.backgroundPositionY = "0px"
  }
  move() {
    this.element.style.backgroundPositionY = `${parseInt(this.element.style.backgroundPositionY) + 1}px`
  }
}

export const space = new Space()