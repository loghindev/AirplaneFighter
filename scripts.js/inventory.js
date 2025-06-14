import { menuAirplane } from "../script.js";
import { uiEffects } from "./sounds.js";

const shipsImagesWrapper = document.querySelector("#inventory .inventory-ships .images");
const bgImagesWrapper = document.querySelector("#inventory .inventory-backgrounds .images");
const bgImage = document.getElementById("bgImage");
const SPEED = 0.6;
let firstSession = true;

//* --- PATHS ---
const shipsGallery = [
  "../assets/ships/type1/1.png",
  "../assets/ships/type1/2.png",
  "../assets/ships/type1/3.png",
  "../assets/ships/type1/4.png",
  "../assets/ships/type2/1.png",
  "../assets/ships/type2/2.png",
  "../assets/ships/type2/3.png",
  "../assets/ships/type2/4.png",
  "../assets/ships/type3/1.png",
  "../assets/ships/type3/2.png",
  "../assets/ships/type3/3.png",
  "../assets/ships/type3/4.png",
];

const bgGallery = [
  "../assets/backgrounds/1.jpeg",
  "../assets/backgrounds/2.jpeg",
  "../assets/backgrounds/3.jpeg",
  "../assets/backgrounds/4.jpeg",
];

document.addEventListener("DOMContentLoaded", loadInventory);

function loadInventory() {
  loadShips();
  loadBackgrounds();
}

function loadShips() {
  const length = shipsGallery.length;
  for (let i = 0; i < length; ++i) {
    const ship = document.createElement("img");
    ship.src = shipsGallery[i];
    ship.style.width = "100%";
    ship.style.filter = "drop-shadow(0 0 20px white)";
    shipsImagesWrapper.appendChild(ship);
  }
  //* HANDLE BUTTONS
  let index = 0;
  const ships = document.querySelectorAll("#inventory .inventory-ships .images img");
  const shipsPrevBtn = document.querySelector("#inventory .inventory-ships .gallery .prev");
  const shipsNextBtn = document.querySelector("#inventory .inventory-ships .gallery .next");
  shipsPrevBtn.addEventListener("click", () => {
    ships[index--].style.display = "none";
    if (index < 0) index = length - 1;
    ships[index].style.display = "block";
    const path = shipsGallery[index].slice(1);
    menuAirplane.src = path;
    uiEffects().play();
  });
  shipsNextBtn.addEventListener("click", () => {
    ships[index++].style.display = "none";
    if (index === length) index = 0;
    ships[index].style.display = "block";
    const path = shipsGallery[index].slice(1);
    menuAirplane.src = path;
    uiEffects().play();
  });
}

function loadBackgrounds() {
  const length = bgGallery.length;
  for (let i = 0; i < length; ++i) {
    const bg = document.createElement("img");
    bg.src = bgGallery[i];
    bg.style.width = "100%";
    bgImagesWrapper.appendChild(bg);
  }
  //* HANDLE BUTTONS
  let index = 0;
  const backgrounds = document.querySelectorAll("#inventory .inventory-backgrounds .images img");
  const bgPrevBtn = document.querySelector("#inventory .inventory-backgrounds .gallery .prev");
  const bgNextBtn = document.querySelector("#inventory .inventory-backgrounds .gallery .next");
  bgPrevBtn.addEventListener("click", () => {
    backgrounds[index--].style.display = "none";
    if (index < 0) index = length - 1;
    backgrounds[index].style.display = "block";
    const path = bgGallery[index].slice(1);
    bgImage.src = path;
    firstSession = false;
    uiEffects().play();
  });
  bgNextBtn.addEventListener("click", () => {
    backgrounds[index++].style.display = "none";
    if (index === length) index = 0;
    backgrounds[index].style.display = "block";
    const path = bgGallery[index].slice(1);
    bgImage.src = path;
    firstSession = false;
    uiEffects().play();
  });
}

//* --- BACKGROUND SCROLL ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
bgImage.src = bgGallery[0].slice(1);
let bgY1 = 0;
let bgY2 = -canvas.height;

bgImage.onload = function () {
  if (!firstSession) return;
  function gameLoop() {
    bgY1 += SPEED;
    bgY2 += SPEED;
    if (bgY1 >= canvas.height) bgY1 = bgY2 - canvas.height;
    if (bgY2 >= canvas.height) bgY2 = bgY1 - canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, bgY1, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, bgY2, canvas.width, canvas.height);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};
