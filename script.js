//* ----- GAME FUNCTIONALITY ------
//* Sections
const mainMenu = document.getElementById("menu");
const storeSection = document.getElementById("store");
const gameSection = document.getElementById("game");
const endMenu = document.getElementById("endMenu");
//* Sections Buttons
const playBtn = document.getElementById("playBtn");
const storeBtn = document.getElementById("storeBtn");
const backToMenuBtn = document.getElementById("backToMenu");
const endMenuBtn = document.getElementById("endMenuBtn");
const endRestartBtn = document.getElementById("endRestartBtn");

const menuAirplane = document.getElementById("menuAirplane");
const airplane = document.getElementById("airplane");
//* Garbage Collector
const bulletsCollector = document.querySelector("#garbageCollector .bullets");
const asteroidsCollector = document.querySelector("#garbageCollector .asteroids");
const powerUpsCollector = document.querySelector("#garbageCollector .power-ups");
const rocketsCollector = document.querySelector("#garbageCollector .rockets");
const coinsCollector = document.querySelector("#garbageCollector .coins");
//* Abilities
const hudHearts = document.querySelector("#hud .hearts .amount");
const hudRockets = document.querySelector("#hud .rockets .amount");
const hudPowerUp = document.querySelector("#hud .power-lvl .amount");
const hudCoins = document.querySelector("#hud .coins .amount");
// ids
let generateAsteroidId = null;
let generatePowerUpGiftId = null;
let generateRocketGiftId = null;

// options
const bulletSpeed = 5;
const giftSpeed = 0.8;
let runningEffect = false;
let lockMovement = false;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  handleMainMenuContext();
  handleEndMenuContext();
});
function loadGame() {
  setHud();
  setAirplaneModel();
  setAirplaneBehavior();
  //! setTimeout()
  generateAsteroids();
  // generatePowerUpGifts();
  // generateRocketGifts();
}
function setHud() {
  hudHearts.textContent = "3";
  hudRockets.textContent = "0";
  hudPowerUp.textContent = "0";
  hudCoins.textContent = "0";
}

//? AIRPLANE
function setAirplaneModel() {
  airplane.src = menuAirplane.getAttribute("src");
}
function setAirplaneBehavior() {
  //* set airplane movement and shooting system
  setAirplaneMovement();
  setAirplaneShooting();
}
function setAirplaneMovement() {
  document.addEventListener("mousemove", (event) => {
    if (lockMovement || gameOver) return; // lock the movement while exploding effect
    let x = event.clientX;
    let y = event.clientY;
    airplane.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  });
}
function setAirplaneShooting() {
  document.addEventListener("click", (event) => {
    shoot(event.clientX, event.clientY);
  });
}
function shoot(x, y) {
  if (lockMovement || gameOver) return; // dont create and move new bullet
  const bullet = createBullet();
  moveBullet(bullet, x, y);
}

//? Generate Asteroids
function generateAsteroids() {
  const delay = Math.floor(Math.random() * 4000);
  const speedY = Math.floor(Math.random() * 3) + 2;
  const asteroid = createAsteroid();
  const randomX = Math.random() * innerWidth;
  const y = -20;
  moveAsteroid(asteroid, randomX, y, speedY);
  generateAsteroidId = setTimeout(generateAsteroids, delay);
}

//? Generate PowerUp Gifts
function generatePowerUpGifts() {
  const delay = Math.floor(Math.random() * 3000) + 3000;
  const powerUp = createPowerUpGift();
  const randomX = Math.random() * innerWidth;
  const y = -20;
  moveGift(powerUp, randomX, y);
  generatePowerUpGiftId = setTimeout(generatePowerUpGifts, delay);
}

//? Generate Rocket Gifts
function generateRocketGifts() {
  const delay = Math.floor(Math.random() * 5000) + 5000;
  const rocketGift = createRocketGift();
  const randomX = Math.random() * innerWidth;
  const y = -20;
  moveGift(rocketGift, randomX, y);
  generateRocketGiftId = setTimeout(generateRocketGifts, delay);
}

//TODO Generate Coin Gifts
function generateCoinGifts(asteroidPointer) {
  const coinGift = createCoinGift();
  const rect = asteroidPointer.getBoundingClientRect();
  moveGift(coinGift, rect.x, rect.y);
  spinCoin(coinGift);
}

//* --- CREATE DOM ELEMENTS ---
function createBullet() {
  const bullet = document.createElement("img");
  bullet.classList = "bullet";
  bullet.src = "https://placehold.co/1x8?text=B";
  bulletsCollector.appendChild(bullet);
  return bullet;
}
function createAsteroid() {
  const asteroid = document.createElement("img");
  asteroid.classList = "asteroid";
  asteroid.src = "https://placehold.co/40x40?text=A";
  asteroid.style.borderRadius = "12px";
  asteroidsCollector.appendChild(asteroid);
  return asteroid;
}
function createPowerUpGift() {
  const powerUp = document.createElement("img");
  powerUp.src = "https://placehold.co/20x20?text=P";
  powerUp.classList = "power-gift";
  powerUp.style.borderRadius = "50%";
  powerUpsCollector.appendChild(powerUp);
  return powerUp;
}
function createRocketGift() {
  const rocketGift = document.createElement("img");
  rocketGift.src = "https://placehold.co/16x16?text=R";
  rocketGift.classList = "rocket-gift";
  rocketsCollector.appendChild(rocketGift);
  return rocketGift;
}
function createCoinGift() {
  const coinGift = document.createElement("img");
  coinGift.src = "https://placehold.co/35x35?text=C";
  coinGift.classList = "coin-gift";
  coinGift.style.borderRadius = "20px";
  coinsCollector.appendChild(coinGift);
  return coinGift;
}

//* --- MOVEMENT ---
function moveBullet(bullet, x, y) {
  let bulletId = null;
  y -= bulletSpeed; // 2
  bullet.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  handleBulletsCollision(bullet);
  if (y > 100) {
    bulletId = requestAnimationFrame(() => {
      moveBullet(bullet, x, y);
    });
  } else {
    cancelAnimationFrame(bulletId);
    bullet.remove();
    // console.log("moveBullet() oprit");
  }
}
function moveAsteroid(asteroid, x, y, speedY) {
  let moveAsteroidId = null;
  y += speedY;
  asteroid.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  checkCollision(airplane, asteroid);
  if (y < innerHeight - 100) {
    moveAsteroidId = requestAnimationFrame(() => {
      moveAsteroid(asteroid, x, y, speedY);
    });
  } else {
    cancelAnimationFrame(moveAsteroidId);
    asteroid.remove();
    // console.log("moveAsteroid() oprit");
  }
}
function moveGift(ability, x, y) {
  let giftId = null;
  y += giftSpeed; // 0.8
  ability.style.transform = `translate(${x}px, ${y}px)`;
  checkCollision(airplane, ability);
  // sa dispara de tot din viewport - 100
  if (y < innerHeight - 100) {
    giftId = requestAnimationFrame(() => {
      moveGift(ability, x, y);
    });
  } else {
    cancelAnimationFrame(giftId);
    ability.remove();
    console.log("moveGift() oprit");
  }
}

//* --- COLLISION ---
function checkCollision(obj1, obj2) {
  if (gameOver) return;
  let a = obj1.getBoundingClientRect();
  let b = obj2.getBoundingClientRect();
  if (a.top < b.bottom && a.bottom > b.top && a.right > b.left && a.left < b.right) {
    if (obj1.id === "airplane" && obj2.classList.contains("asteroid")) {
      obj2.remove();
      destroyAirplane();
      decreasePower();
      decreaseHeart();
      decreaseCoins();
    } else if (obj1.classList.contains("bullet") && obj2.classList.contains("asteroid")) {
      [1, 2, 3, 4][Math.floor(Math.random() * 3)] === 1 ? generateCoinGifts(obj2) : "";
      obj1.remove();
      obj2.remove();
    } else if (obj1.id === "airplane" && obj2.classList.contains("power-gift")) {
      obj2.remove();
      incrementPower();
    } else if (obj1.id === "airplane" && obj2.classList.contains("rocket-gift")) {
      obj2.remove();
      incrementRocketStorage();
      // console.log("airplane x rocket");
    } else if (obj1.id === "airplane" && obj2.classList.contains("coin-gift")) {
      obj2.remove();

      incrementCoins();
      // console.log("airplane x coin");
    }
  }
}
function handleBulletsCollision(bullet) {
  const viewAsteroids = document.querySelectorAll("#garbageCollector .asteroids *");
  viewAsteroids.forEach((asteroid) => checkCollision(bullet, asteroid));
}

//* INCREASE STATISTICS

function incrementRocketStorage() {
  let amount = Number(hudRockets.textContent);
  hudRockets.textContent = (++amount).toString();
}
function incrementPower() {
  let amount = Number(hudPowerUp.textContent);
  hudPowerUp.textContent = (++amount).toString();
}

//* DECREASE STATS
function decreaseHeart() {
  let amount = Number(hudHearts.textContent);
  hudHearts.textContent = (--amount).toString();
}
function decreasePower() {
  let amount = Number(hudPowerUp.textContent);
  if (amount <= 3) {
    amount = 0;
  } else {
    amount -= 3;
  }
  hudPowerUp.textContent = amount.toString();
}
function decreaseCoins() {
  let amount = Number(hudCoins.textContent);
  if (amount <= 5) {
    amount = 0;
  } else {
    amount -= 5;
  }
  hudCoins.textContent = amount.toString();
}

// coins
function incrementCoins() {
  let amount = Number(hudCoins.textContent);
  hudCoins.textContent = (++amount).toString();
}

//* --- DESTROY ---
function destroyAirplane() {
  if (runningEffect) return; // don't run effect again
  runningEffect = true;
  lockMovement = true;
  explodeAirplane(); // run effect
}

//* --- EFFECTS ---
function explodeAirplane() {
  let index = 0;
  let explodeAirplaneId = setInterval(() => {
    if (index < shipExplosion.length) {
      airplane.src = shipExplosion[index++];
    } else {
      clearInterval(explodeAirplaneId);
      // console.log("explodeAirplaneId oprit");
      setTimeout(() => {
        //* reset flags
        runningEffect = false;
        lockMovement = false;
        if (hudHearts.textContent === "0") {
          endGame();
          return;
        }
        airplane.style.transform = `translate(${innerWidth}px, ${innerHeight * 2}px)`;
        setAirplaneModel();
      }, 700);
    }
  }, 60);
}

function spinCoin(coin) {
  let index = 0;
  let spinCoinId = setInterval(() => {
    if (index < coinSpin.length) {
      console.log("Spinning Coin...");
      coin.src = coinSpin[index++];
    } else {
      index = 0;
      coin.src = coinSpin[index++];
    }
    // console.log(coin.getBoundingClientRect().top);

    if (coin.getBoundingClientRect().y === 0) {
      clearInterval(spinCoinId);
      console.log("spinCoinId() Stopped");
    }
  }, 50);
}

//* --- END GAME ---
function endGame() {
  gameOver = true;
  clearTimeout(generateAsteroidId);
  clearTimeout(generatePowerUpGiftId);
  clearTimeout(generateRocketGiftId);

  clearScreen();
  displayEndContextMenu();
}

//* --- HANDLE CONTEXT MENUS ACTIONS ---
function handleMainMenuContext() {
  // Start Game from Main Menu
  playBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden-section");
    gameSection.classList.remove("hidden-section");
    gameOver = false;
    loadGame();
  });
  // Go to Store Page
  storeBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden-section");
    storeSection.classList.remove("hidden-section");
    backToMenuBtn.addEventListener("click", () => {
      mainMenu.classList.remove("hidden-section");
      storeSection.classList.add("hidden-section");
    });
  });
}
function handleEndMenuContext() {
  // Go Gome from end menu context
  endMenuBtn.addEventListener("click", () => {
    endMenu.classList.add("hidden-section");
    gameSection.classList.add("hidden-section");
    mainMenu.classList.remove("hidden-section");
  });
  // Restart Game because you're addicted
  endRestartBtn.addEventListener("click", () => {
    endMenu.classList.add("hidden-section");
    gameOver = false;
    loadGame();
  });
}
function displayEndContextMenu() {
  endMenu.classList.remove("hidden-section");
}

//* UTILITY FUNCTIONS
function clearScreen() {
  const asteroidsLeft = asteroidsCollector.querySelectorAll("img");
  const powersLeft = powerUpsCollector.querySelectorAll("img");
  const rocketsLeft = rocketsCollector.querySelectorAll("img");
  const coinsLeft = coinsCollector.querySelectorAll("img");
  if (asteroidsLeft.length) asteroidsLeft.forEach((asteroid) => asteroid.remove());
  if (powersLeft.length) powersLeft.forEach((powerup) => powerup.remove());
  if (rocketsLeft.length) rocketsLeft.forEach((rocket) => rocket.remove());
  if (coinsLeft.length) coinsLeft.forEach((coin) => coin.remove());
}

//* --- FRAMES PATHS ---
const shipExplosion = [
  "./assets/explosion/13/1.png",
  "./assets/explosion/13/2.png",
  "./assets/explosion/13/3.png",
  "./assets/explosion/13/4.png",
  "./assets/explosion/13/5.png",
  "./assets/explosion/13/6.png",
  "./assets/explosion/13/7.png",
  "./assets/explosion/13/8.png",
  "./assets/explosion/13/9.png",
  "./assets/explosion/13/10.png",
  "./assets/explosion/13/11.png",
  "./assets/explosion/13/12.png",
  "./assets/explosion/13/13.png",
  "./assets/explosion/13/14.png",
  "./assets/explosion/13/15.png",
  "./assets/explosion/13/16.png",
  "./assets/explosion/13/17.png",
  "./assets/explosion/13/18.png",
  "./assets/explosion/13/19.png",
  "./assets/explosion/13/20.png",
  "./assets/explosion/13/21.png",
  "./assets/explosion/13/22.png",
  "./assets/explosion/13/23.png",
  "./assets/explosion/13/24.png",
];

const coinSpin = [
  "./assets/coin/spr_coin_0.png",
  "./assets/coin/spr_coin_1.png",
  "./assets/coin/spr_coin_2.png",
  "./assets/coin/spr_coin_3.png",
  "./assets/coin/spr_coin_4.png",
  "./assets/coin/spr_coin_5.png",
  "./assets/coin/spr_coin_6.png",
  "./assets/coin/spr_coin_7.png",
  "./assets/coin/spr_coin_8.png",
  "./assets/coin/spr_coin_9.png",
  "./assets/coin/spr_coin_10.png",
  "./assets/coin/spr_coin_11.png",
  "./assets/coin/spr_coin_12.png",
  "./assets/coin/spr_coin_13.png",
  "./assets/coin/spr_coin_14.png",
  "./assets/coin/spr_coin_15.png",
  "./assets/coin/spr_coin_16.png",
  "./assets/coin/spr_coin_17.png",
  "./assets/coin/spr_coin_18.png",
  "./assets/coin/spr_coin_19.png",
  "./assets/coin/spr_coin_20.png",
  "./assets/coin/spr_coin_21.png",
  "./assets/coin/spr_coin_22.png",
  "./assets/coin/spr_coin_23.png",
  "./assets/coin/spr_coin_24.png",
  "./assets/coin/spr_coin_25.png",
  "./assets/coin/spr_coin_26.png",
  "./assets/coin/spr_coin_27.png",
  "./assets/coin/spr_coin_28.png",
  "./assets/coin/spr_coin_29.png",
  "./assets/coin/spr_coin_30.png",
];
