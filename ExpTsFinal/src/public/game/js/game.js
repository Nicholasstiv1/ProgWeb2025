import { FPS, TAMY, TAMX } from "./config.js"
import { space } from "./space.js"
import { ship } from "./ship.js"
import { createRandomEnemyShip, moveEnemyShips, getEnemyShips } from "./enemyShip.js"
import { moveShots } from "./shot.js"
import { moveEnemyShots } from "./enemyShot.js"
import { Obstacle } from "./obstacle.js"

let gameStarted = false
let isPaused = false
let gameLoopId = null
const obstacles = []

window.gameObstacles = obstacles
window.gameEnemyShips = getEnemyShips ? getEnemyShips() : []

let score = 0
let lives = 3

let lastObstacleTime = 0
let obstacleSpeedMin = 1
let obstacleSpeedMax = 3
let obstacleCooldown = 1000

let gameStartTime = Date.now()
let lastDifficultyIncrease = gameStartTime

document.addEventListener('score', (e) => {
  score += e.detail.points
  updateHUD()
})

document.addEventListener('damage', (e) => {
  lives -= e.detail.lives
  updateHUD()

  if (lives <= 0) {
    gameOver()
  } else {
    ship.takeDamage()
  }
})

function gameOver() {
  isPaused = true

  ship.cleanup()
  
  if (typeof saveScoreToServer === 'function') {
    saveScoreToServer(score);
  } else {
    console.warn('Função saveScoreToServer não encontrada.');
  }

  const gameOverDiv = document.createElement('div')
  gameOverDiv.id = 'game-over'
  gameOverDiv.innerHTML = `
    <h1>Game Over</h1>
    <p>Pontuação final: ${score}</p>
    <button id="restart-btn">Jogar Novamente</button>
  `

  space.element.appendChild(gameOverDiv)

  document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload()
  })
}

function startGame() {
  if (!gameStarted) {
    createHUD()
    updateHUD()
    gameLoopId = setInterval(run, 1000 / FPS)
    gameStarted = true
    isPaused = false
    console.log("Jogo iniciado!")
  }
}

function togglePause() {
  if (!gameStarted) return
  isPaused = !isPaused
}

window.addEventListener("keydown", (e) => {
  if (!gameStarted && (e.code === "Space" || e.key === "Enter" || e.key === "s")) {
    startGame()
  }

  if (gameStarted && !isPaused) {
    if (e.key === " " || e.code === "Space") {
      ship.shoot()
      e.preventDefault()
    }
  }

  if (gameStarted && e.key === "p") {
    togglePause()
  }
})

function createHUD() {
  const hud = document.createElement("div")
  hud.id = "hud"

  const scoreEl = document.createElement("span")
  scoreEl.id = "score"
  scoreEl.textContent = "Pontos: 0"

  const livesEl = document.createElement("span")
  livesEl.id = "lives"

  hud.appendChild(livesEl)
  hud.appendChild(scoreEl)

  document.getElementById("space").appendChild(hud)
}

function updateHUD() {
  const scoreEl = document.getElementById("score")
  const livesEl = document.getElementById("lives")

  scoreEl.textContent = `Pontos: ${score}`

  livesEl.innerHTML = ""
  for (let i = 0; i < lives; i++) {
    const lifeIcon = document.createElement("img")
    lifeIcon.src = "./assets/png/life.png"
    lifeIcon.classList.add("life")
    livesEl.appendChild(lifeIcon)
  }
}

function isOverlapping(newX, newWidth) {
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

export function createRandomObstacle() {
  const now = Date.now()
  if (now - lastObstacleTime < obstacleCooldown) return
  lastObstacleTime = now

  const types = ["enemyUFO", "meteorSmall", "meteorBig"]
  const type = types[Math.floor(Math.random() * types.length)]

  const speed = obstacleSpeedMin + Math.random() * (obstacleSpeedMax - obstacleSpeedMin)

  const width = 50
  let x
  let attempts = 5
  do {
    x = Math.random() * (TAMX - width)
    attempts--
  } while (isOverlapping(x, width) && attempts > 0)

  if (attempts <= 0) return

  const obstacle = new Obstacle(type, speed, x)
  obstacles.push(obstacle)
}

export function moveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i]
    obs.move()

    if (checkCollisionWithPlayer(obs.element)) {
      if (ship.takeDamage()) {
        const damageEvent = new CustomEvent('damage', {
          detail: { lives: 1 }
        });
        document.dispatchEvent(damageEvent);

        createExplosionEffect(obs.element);

        obs.remove()
        obstacles.splice(i, 1)
        continue
      }
    }

    if (obs.isOutOfScreen(TAMY)) {
      obs.remove()
      obstacles.splice(i, 1)
    }
  }
}

function checkEnemyShipCollisions() {
  const enemyShips = getEnemyShips()

  for (let i = enemyShips.length - 1; i >= 0; i--) {
    const enemyShip = enemyShips[i]

    if (checkCollisionWithPlayer(enemyShip.element)) {
      if (ship.takeDamage()) {
        const damageEvent = new CustomEvent('damage', {
          detail: { lives: 1 }
        });
        document.dispatchEvent(damageEvent);

        createExplosionEffect(enemyShip.element);

        enemyShip.remove()
        enemyShips.splice(i, 1)

        const scoreEvent = new CustomEvent('score', {
          detail: { points: 50 }
        });
        document.dispatchEvent(scoreEvent);

        break;
      }
    }
  }
}

function run() {
  if (isPaused) return

  space.move()
  ship.move()
  createRandomEnemyShip()
  moveEnemyShips()
  moveShots()
  moveEnemyShots()
  createRandomObstacle()
  moveObstacles()

  checkEnemyShipCollisions()

  const now = Date.now()
  if (now - lastDifficultyIncrease >= 20000) {
    obstacleSpeedMin += 0.5
    obstacleSpeedMax += 0.5

    if (obstacleCooldown > 800) {
      obstacleCooldown -= 200
    }

    console.log("Aumento de dificuldade! Velocidade média agora:", obstacleSpeedMin.toFixed(1), "-", obstacleSpeedMax.toFixed(1))
    lastDifficultyIncrease = now
  }
}

function checkCollisionWithPlayer(element) {
  const elementRect = element.getBoundingClientRect()
  const playerRect = ship.element.getBoundingClientRect()

  return !(
    elementRect.right < playerRect.left ||
    elementRect.left > playerRect.right ||
    elementRect.bottom < playerRect.top ||
    elementRect.top > playerRect.bottom
  )
}

function createExplosionEffect(element) {
  const explosion = document.createElement("img");
  explosion.className = "explosion";
  explosion.src = "./assets/png/laserRedShot.png";

  const rect = element.getBoundingClientRect();
  const spaceRect = space.element.getBoundingClientRect();

  explosion.style.position = "absolute";
  explosion.style.left = `${rect.left - spaceRect.left + rect.width / 2 - 25}px`;
  explosion.style.top = `${rect.top - spaceRect.top + rect.height / 2 - 25}px`;
  explosion.style.zIndex = "100";

  space.element.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 500);
}