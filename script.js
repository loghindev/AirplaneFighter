//* ----- GAME FUNCTIONALITY ------
import {
  launchRocketEffect,
  rocketExplosionEffect,
  energyWarningEffect,
  energyExpireEffect,
} from "./scripts.js/sounds.js";
//* Sections
const mainMenu = document.getElementById("menu");
const gameSection = document.getElementById("game");
const endMenu = document.getElementById("endMenu");
const pauseMenu = document.getElementById("pauseMenu");
//* Sections Buttons
const playBtn = document.getElementById("playBtn");
const endMenuBtn = document.getElementById("endMenuBtn");
const endRestartBtn = document.getElementById("endRestartBtn");
const pauseMenuBtn = document.getElementById("pauseMenuBtn");
const pauseContinueBtn = document.getElementById("pauseContinueBtn");

//* Airplane
export const menuAirplane = document.getElementById("menuAirplane");
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
const hudScore = document.querySelector("#energyPanel .score");
//* ids
let generateAsteroidId = null;
let generatePowerUpGiftId = null;
let generateRocketGiftId = null;
let reloadInterval = null;
let scoreId = null;
//* options
const bulletSpeed = 5;
const rocketSpeed = 2; // 2.5
const giftSpeed = 0.8;
let indexScore = 0;
let runningEffect = false;
let lockMovement = false;
let warningBar = false;
let expired = false;
let once = true;
let gameOver = false;
let paused = false; //! DE CONTINUAT

document.addEventListener("DOMContentLoaded", () => {
  handleMainMenuContext();
  handleEndMenuContext();
});
function loadGame() {
  setHud();
  setAirplaneModel();
  if (once) {
    setAirplaneBehavior();
    once = false;
  }
  setTimeout(generateAsteroids, 0); //TODO - while dev
  // const powerDelay = Math.floor(Math.random() * 3000) + 6000;
  // const rocketDelay = Math.floor(Math.random() * 3000) + 6000;
  // console.log(powerDelay);
  // console.log(rocketDelay);

  setTimeout(generatePowerUpGifts, 0); // powerDelay
  setTimeout(generateRocketGifts, 0); // rocketDelay
  indexScore = 0;
  handleScore();
  document.body.style.cursor = "none";
}
function setHud() {
  hudHearts.textContent = "3";
  hudRockets.textContent = "100";
  hudPowerUp.textContent = "0";
  hudCoins.textContent = "0";
  hudScore.textContent = "00000";
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
    if (lockMovement || gameOver) return; // lockMovement is true while explosion effect
    const x = event.clientX;
    const y = event.clientY;
    airplane.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  });
}
function setAirplaneShooting() {
  //* Handle basic bullets (left click)
  document.addEventListener("click", (event) => {
    if (event.target.id !== "endRestartBtn") {
      shoot(event.clientX, event.clientY);
    }
  });
  //* Handle rockets (right click)
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (Number(hudRockets.textContent) > 0 && !paused && !lockMovement && !gameOver) {
      shootRocket(event.clientX, event.clientY);
      launchRocketEffect().play();
    } else {
      console.warn("NO BULLETS");
      // run error sound
    }
  });
}
function shoot(x, y) {
  if (lockMovement || expired || gameOver) return;
  const bullet = createBullet();
  moveBullet(bullet, x, y);
  useEnergy();
}
function shootRocket(x, y) {
  const rocket = createRocket();
  rocketsCollector.appendChild(rocket);
  moveBullet(rocket, x, y);
  decreaseRocket();
}

//? Generate Asteroids
function generateAsteroids() {
  const delay = Math.floor(Math.random() * 3500);
  const speedY = Math.floor(Math.random() * 3.5) + 2;
  const asteroid = createAsteroid();
  const randomX = Math.random() * innerWidth;
  const y = -100;
  moveAsteroid(asteroid, randomX, y, speedY);
  generateAsteroidId = setTimeout(generateAsteroids, delay);
}

//? Generate PowerUp Gifts
function generatePowerUpGifts() {
  const delay = Math.floor(Math.random() * 3000) + 3000;
  const powerUp = createPowerUpGift();
  const randomX = Math.random() * innerWidth;
  const y = -100;
  moveGift(powerUp, randomX, y);
  generatePowerUpGiftId = setTimeout(generatePowerUpGifts, delay);
}

//? Generate Rocket Gifts
function generateRocketGifts() {
  const delay = Math.floor(Math.random() * 3000) + 3000;
  const rocketGift = createRocketGift();
  const randomX = Math.random() * innerWidth;
  const y = -100;
  moveGift(rocketGift, randomX, y);
  generateRocketGiftId = setTimeout(generateRocketGifts, delay);
}

//? Generate Coin Gifts
function generateCoinGifts(asteroidPointer) {
  const coinGift = createCoinGift();
  const rect = asteroidPointer.getBoundingClientRect();
  moveGift(coinGift, rect.x + rect.width / 2 - 18, rect.y);
  spinCoin(coinGift);
}

//* --- CREATE DOM ELEMENTS ---
function createBullet() {
  const bullet = document.createElement("img");
  bullet.classList = "bullet";
  //TODO Modifica bullet in functie de powerup (fix aici)
  bullet.src = "./assets/projectiles/red/slim.png";
  bulletsCollector.appendChild(bullet);
  return bullet;
}
function createAsteroid() {
  const asteroid = document.createElement("img");
  asteroid.classList = "asteroid";
  asteroid.src = asteroidsGallery[Math.floor(Math.random() * asteroidsGallery.length)];
  asteroid.style.transform = `translate(-50%, -50%)`;
  asteroid.style.borderRadius = "50px";
  asteroidsCollector.appendChild(asteroid);
  return asteroid;
}
function createPowerUpGift() {
  const powerUp = document.createElement("img");
  powerUp.src = "./assets/powerup.png";
  powerUp.classList.add("power-gift");
  powerUpsCollector.appendChild(powerUp);
  return powerUp;
}
function createRocketGift() {
  const rocketGift = document.createElement("img");
  rocketGift.src = "./assets/rocket/rocket-gift.png";
  rocketGift.classList = "rocket-gift";
  rocketsCollector.appendChild(rocketGift);
  return rocketGift;
}
function createCoinGift() {
  const coinGift = document.createElement("img");
  coinGift.classList.add("coin-gift");
  coinGift.style.width = "35px";
  coinsCollector.appendChild(coinGift);
  return coinGift;
}
function createRocket() {
  const rocketWrapper = document.createElement("div");
  const rocketBoom = document.createElement("img");
  const rocketFlame = document.createElement("img");
  rocketWrapper.classList = "rocket-wrapper";
  rocketBoom.classList = "rocket";
  rocketBoom.src = "./assets/rocket/rocket.png";
  rocketFlame.classList = "rocket-flame";
  // ceva
  rocketWrapper.append(rocketBoom, rocketFlame);
  animateRocketFlames(rocketFlame);
  return rocketWrapper;
}

//* --- MOVEMENT ---
function moveBullet(bullet, x, y) {
  let bulletId = null;
  if (bullet.classList.contains("rocket-wrapper")) {
    y -= rocketSpeed; // 2
  } else {
    y -= bulletSpeed; // 5
  }
  bullet.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  handleBulletsCollision(bullet);
  //* Handle rocket movement and stop position

  if (bullet.classList.contains("rocket-wrapper")) {
    if (y > 200) {
      bulletId = requestAnimationFrame(() => {
        moveBullet(bullet, x, y);
      });
    } else {
      cancelAnimationFrame(bulletId);
      clearScreen(bullet);
      explodeRocket(bullet);
      launchRocketEffect().pause();
      rocketExplosionEffect().play();
      bullet.remove();

      console.log("bulletId() oprit");
    }
    return;
  }
  //* Handle basic bullet movement and stop position
  if (y > -150) {
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
  asteroid.style.transform = `translate(${x}px, ${y}px)`;
  checkCollision(airplane, asteroid);
  if (y < innerHeight + 150) {
    moveAsteroidId = requestAnimationFrame(() => {
      moveAsteroid(asteroid, x, y, speedY);
    });
  } else {
    cancelAnimationFrame(moveAsteroidId);
    asteroid.remove();
    console.log("moveAsteroid() oprit");
  }
}
function moveGift(ability, x, y) {
  let giftId = null;
  y += giftSpeed; // 0.8
  ability.style.transform = `translate(${x}px, ${y}px)`;
  checkCollision(airplane, ability);
  // sa dispara de tot din viewport - 100
  if (y < innerHeight + 150) {
    giftId = requestAnimationFrame(() => {
      moveGift(ability, x, y);
    });
  } else {
    cancelAnimationFrame(giftId);
    ability.remove();
    // console.log("moveGift() oprit");
  }
}

//* --- COLLISION ---
function checkCollision(obj1, obj2) {
  if (gameOver) return;
  let a = obj1.getBoundingClientRect();
  let b = obj2.getBoundingClientRect();
  if (a.top < b.bottom && a.bottom > b.top && a.right > b.left && a.left < b.right) {
    // found collision
    if (obj1.id === "airplane" && obj2.classList.contains("asteroid")) {
      //!AIRPLANE X ASTEROID
      obj2.remove();
      destroyAirplane();
      decreasePower();
      decreaseHeart();
      indexScore -= 250; // lose score
      updateScoreValue();
    } else if (obj1.classList.contains("bullet") && obj2.classList.contains("asteroid")) {
      //!BULLET X ASTEROID
      [1, 2, 3, 4][Math.floor(Math.random() * 3)] === 1 ? generateCoinGifts(obj2) : "";
      obj1.remove();
      explodeAsteroid(obj2);
      incrementScore(obj2);
    } else if (obj1.id === "airplane" && obj2.classList.contains("power-gift")) {
      //!AIRPLANE X POWER UP GIFT
      obj2.remove();
      incrementPower();
    } else if (obj1.id === "airplane" && obj2.classList.contains("rocket-gift")) {
      //!AIRPLANE X ROCKET GIFT
      obj2.remove();
      incrementRocketStorage();
      // console.log("airplane x rocket");
    } else if (obj1.id === "airplane" && obj2.classList.contains("coin-gift")) {
      //!AIRPLANE X COIN GIFT
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
function incrementCoins() {
  let amount = Number(hudCoins.textContent);
  hudCoins.textContent = (++amount).toString();
}
function incrementScore(obj) {
  if (obj.classList.contains("asteroid")) {
    indexScore += 50;
  }
  updateScoreValue();
}

//* DECREASE STATS
function decreaseHeart() {
  let amount = Number(hudHearts.textContent);
  if (amount - 1 >= 0) {
    hudHearts.textContent = (--amount).toString();
  }
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
function decreaseRocket() {
  let amount = Number(hudRockets.textContent);
  hudRockets.textContent = (--amount).toString();
}

//* --- DESTROY ---
function destroyAirplane() {
  if (runningEffect) return; // don't run effect again
  //* Set flags
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
        //* Reset flags
        runningEffect = false;
        lockMovement = false;
        if (Number(hudHearts.textContent) <= 0) {
          endGame();
          return;
        }
        //? I FORGOT WHY I DID THIS, BUT IT WORKS
        airplane.style.transform = `translate(${innerWidth}px, ${innerHeight * 2}px)`;
        setAirplaneModel();
      }, 700);
    }
  }, 60);
}
function spinCoin(coin) {
  let index = 0;
  const lenght = coinSpin.length;
  let spinCoinId = setInterval(() => {
    if (index > lenght - 1) {
      index = 0;
    }
    coin.src = coinSpin[index++];
    if (coin.getBoundingClientRect().y === 0) {
      clearInterval(spinCoinId);
    }
  }, 50);
}
function explodeAsteroid(asteroid) {
  const rect = asteroid.getBoundingClientRect();
  asteroid.remove();
  let index = 0;
  const img = document.createElement("img");
  img.classList = "destroyed";
  img.style.transform = `translate(calc(${rect.x + rect.width / 2}px - 50%), ${rect.y + 25}px)`;
  asteroidsCollector.appendChild(img);
  let explodeAsteroidId = setInterval(() => {
    if (index < asteroidExplosion.length) {
      img.src = asteroidExplosion[index++];
    } else {
      clearInterval(explodeAsteroidId);
      img.remove();
    }
  }, 50);
}
function explodeRocket(rocket) {
  const rect = rocket.getBoundingClientRect();
  const img = document.createElement("img");
  img.classList = "rocket-explosion";
  img.style.transform = `translate(calc(${rect.x + rect.width / 2}px - 50%), ${rect.y + 10}px)`;
  rocketsCollector.appendChild(img);
  let index = 0;
  const length = flamesGallery.length;
  let rocketExplodeId = setInterval(() => {
    if (index < length) {
      img.src = rocketExplosion[index++];
    } else {
      clearInterval(rocketExplodeId);
      console.log("rocketExplodeId() oprit");
      img.remove();
    }
  }, 50);
}
function animateRocketFlames(image) {
  let index = 0;
  const length = flamesGallery.length;
  let rocketFlamesId = setInterval(() => {
    if (index > length - 1) {
      index = 0;
    }
    image.src = flamesGallery[index++];
    if (image.getBoundingClientRect().y === 0) {
      clearInterval(rocketFlamesId);
      // console.log("rocketFlamesId() oprit");
    }
  }, 20);
}

//* --- END GAME ---
function endGame() {
  gameOver = true;
  clearTimeout(generateAsteroidId);
  clearTimeout(generatePowerUpGiftId);
  clearTimeout(generateRocketGiftId);
  clearInterval(reloadInterval);
  clearInterval(scoreId);
  displayEndContextMenu();
  clearScreen(null);
  // indexScore = 0;
  document.body.style.cursor = "default";
}

//* --- HANDLE CONTEXT MENUS ACTIONS ---
function handleMainMenuContext() {
  // Start Game from Main Menu
  playBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden-section");
    gameSection.classList.remove("hidden-section");

    gameOver = false;
    setTimeout(loadGame, 2);
  });
}
function handleEndMenuContext() {
  // Go Gome from end menu context
  endMenuBtn.addEventListener("click", () => {
    endGame();
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
function clearScreen(bullet) {
  const asteroidsLeft = asteroidsCollector.querySelectorAll("img");
  const powersLeft = powerUpsCollector.querySelectorAll("img");
  const rocketsLeft = rocketsCollector.querySelectorAll(".rocket-wrapper");
  const coinsLeft = coinsCollector.querySelectorAll("img");
  if (bullet === null) {
    //* Clear entire screen
    if (asteroidsLeft.length) asteroidsLeft.forEach((asteroid) => asteroid.remove());
    if (powersLeft.length) powersLeft.forEach((powerup) => powerup.remove());
    if (rocketsLeft.length) rocketsLeft.forEach((rocket) => rocket.remove());
    if (coinsLeft.length) coinsLeft.forEach((coin) => coin.remove());
  } else if (bullet.classList.contains("rocket-wrapper")) {
    if (asteroidsLeft.length)
      asteroidsLeft.forEach((asteroid) => {
        incrementScore(asteroid);
        explodeAsteroid(asteroid);
      });
  }
}

function handleScore() {
  scoreId = setInterval(() => {
    updateScoreValue();
  }, 666);
}
function updateScoreValue() {
  if (indexScore < 0) {
    indexScore = 0;
    hudScore.textContent = `00000`;
  } else if (indexScore < 10) {
    hudScore.textContent = `0000${indexScore}`;
  } else if (indexScore < 100) {
    hudScore.textContent = `000${indexScore}`;
  } else if (indexScore < 1000) {
    hudScore.textContent = `00${indexScore}`;
  } else if (indexScore < 10000) {
    hudScore.textContent = `0${indexScore}`;
  } else if (indexScore < 100000) {
    hudScore.textContent = indexScore;
  } else {
    indexScore = 0;
  }
  indexScore++;
}
//! ENERGY BAR

function useEnergy() {
  const bars = document.querySelectorAll("#energyPanel .energyBars .fill-percent");
  bars.forEach((bar) => {
    const style = getComputedStyle(bar);
    let translateX = parseFloat(style.transform.split(", ")[4]);
    let newTranslateX = translateX + 21;
    bar.style.transform = `translateX(${newTranslateX}px)`;
    if (newTranslateX <= -15) {
      reloadEnergy();
    } else {
      expireEnergy();
    }
    if (newTranslateX >= -70 && !warningBar) {
      warningBar = true;
      energyWarningEffect().play();
      console.log("warningBar true");
    } else if (newTranslateX <= -120) {
      warningBar = false;
      console.log("warningBar false");
    }
  });
}
function expireEnergy() {
  expired = true;
  energyExpireEffect().play();
  setTimeout(() => {
    reloadEnergy();
    expired = false;
  }, 4500);
}
function reloadEnergy() {
  if (reloadInterval !== null) clearInterval(reloadInterval);
  reloadInterval = setInterval(() => {
    const bars = document.querySelectorAll("#energyPanel .energyBars .fill-percent");
    bars.forEach((bar) => {
      const style = window.getComputedStyle(bar);
      const translateX = Number(style.transform.split(", ")[4]);
      let newTranslateX = translateX - (!expired ? 1 : 1.4);
      if (newTranslateX >= -bar.getBoundingClientRect().width - 2) {
        bar.style.transform = `translateX(${newTranslateX}px)`;
      } else {
        clearInterval(reloadInterval);
        reloadInterval = null;
        // console.log("reloadInterval() oprit");
      }
    });
  }, 20);
}

//* --- PATHS ---
const shipExplosion = [
  "./assets/explosion/ship/1.png",
  "./assets/explosion/ship/2.png",
  "./assets/explosion/ship/3.png",
  "./assets/explosion/ship/4.png",
  "./assets/explosion/ship/5.png",
  "./assets/explosion/ship/6.png",
  "./assets/explosion/ship/7.png",
  "./assets/explosion/ship/8.png",
  "./assets/explosion/ship/9.png",
  "./assets/explosion/ship/10.png",
  "./assets/explosion/ship/11.png",
  "./assets/explosion/ship/12.png",
  "./assets/explosion/ship/13.png",
  "./assets/explosion/ship/14.png",
  "./assets/explosion/ship/15.png",
  "./assets/explosion/ship/16.png",
  "./assets/explosion/ship/17.png",
  "./assets/explosion/ship/18.png",
  "./assets/explosion/ship/19.png",
  "./assets/explosion/ship/20.png",
  "./assets/explosion/ship/21.png",
  "./assets/explosion/ship/22.png",
  "./assets/explosion/ship/23.png",
  "./assets/explosion/ship/24.png",
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
const asteroidExplosion = [
  "./assets/explosion/asteroid/1.png",
  "./assets/explosion/asteroid/2.png",
  "./assets/explosion/asteroid/3.png",
  "./assets/explosion/asteroid/4.png",
  "./assets/explosion/asteroid/5.png",
  "./assets/explosion/asteroid/6.png",
  "./assets/explosion/asteroid/7.png",
  "./assets/explosion/asteroid/8.png",
  "./assets/explosion/asteroid/9.png",
];
const asteroidsGallery = [
  "./assets/asteroids/big/big1.png",
  "./assets/asteroids/big/big2.png",
  "./assets/asteroids/big/big3.png",
  "./assets/asteroids/big/big4.png",
  "./assets/asteroids/big/big5.png",
  "./assets/asteroids/big/big6.png",
  "./assets/asteroids/big/big7.png",
  "./assets/asteroids/big/big8.png",
  "./assets/asteroids/medium/medium1.png",
  "./assets/asteroids/medium/medium2.png",
  "./assets/asteroids/medium/medium3.png",
  "./assets/asteroids/medium/medium4.png",
  "./assets/asteroids/small/small1.png",
  "./assets/asteroids/small/small2.png",
  "./assets/asteroids/small/small3.png",
  "./assets/asteroids/small/small4.png",
];
const rocketExplosion = [
  "./assets/explosion/rocket/expl_10_0000.png",
  "./assets/explosion/rocket/expl_10_0002.png",
  "./assets/explosion/rocket/expl_10_0003.png",
  "./assets/explosion/rocket/expl_10_0004.png",
  "./assets/explosion/rocket/expl_10_0005.png",
  "./assets/explosion/rocket/expl_10_0006.png",
  "./assets/explosion/rocket/expl_10_0007.png",
  "./assets/explosion/rocket/expl_10_0008.png",
  "./assets/explosion/rocket/expl_10_0009.png",
  "./assets/explosion/rocket/expl_10_0010.png",
  "./assets/explosion/rocket/expl_10_0011.png",
  "./assets/explosion/rocket/expl_10_0012.png",
  "./assets/explosion/rocket/expl_10_0013.png",
  "./assets/explosion/rocket/expl_10_0014.png",
  "./assets/explosion/rocket/expl_10_0015.png",
  "./assets/explosion/rocket/expl_10_0016.png",
  "./assets/explosion/rocket/expl_10_0017.png",
  "./assets/explosion/rocket/expl_10_0018.png",
  "./assets/explosion/rocket/expl_10_0019.png",
  "./assets/explosion/rocket/expl_10_0020.png",
  "./assets/explosion/rocket/expl_10_0021.png",
  "./assets/explosion/rocket/expl_10_0022.png",
  "./assets/explosion/rocket/expl_10_0023.png",
  "./assets/explosion/rocket/expl_10_0024.png",
  "./assets/explosion/rocket/expl_10_0025.png",
  "./assets/explosion/rocket/expl_10_0026.png",
  "./assets/explosion/rocket/expl_10_0027.png",
  "./assets/explosion/rocket/expl_10_0028.png",
  "./assets/explosion/rocket/expl_10_0029.png",
  "./assets/explosion/rocket/expl_10_0030.png",
  "./assets/explosion/rocket/expl_10_0031.png",
];
const flamesGallery = [
  "./assets/rocket/rocket_flame/rocket_1_0000.png",
  "./assets/rocket/rocket_flame/rocket_1_0001.png",
  "./assets/rocket/rocket_flame/rocket_1_0002.png",
  "./assets/rocket/rocket_flame/rocket_1_0003.png",
  "./assets/rocket/rocket_flame/rocket_1_0004.png",
  "./assets/rocket/rocket_flame/rocket_1_0005.png",
  "./assets/rocket/rocket_flame/rocket_1_0006.png",
  "./assets/rocket/rocket_flame/rocket_1_0007.png",
  "./assets/rocket/rocket_flame/rocket_1_0008.png",
  "./assets/rocket/rocket_flame/rocket_1_0009.png",
  "./assets/rocket/rocket_flame/rocket_1_0010.png",
  "./assets/rocket/rocket_flame/rocket_1_0011.png",
  "./assets/rocket/rocket_flame/rocket_1_0012.png",
  "./assets/rocket/rocket_flame/rocket_1_0013.png",
  "./assets/rocket/rocket_flame/rocket_1_0014.png",
  "./assets/rocket/rocket_flame/rocket_1_0015.png",
];
