//* ROCKET BOOM
const launchRocketAudio = new Audio("../assets/sounds/launch_rocket.wav");
const rocketExplodeAudio = new Audio("../assets/sounds/rocket_explosion.wav");

function rocketEffects() {
  const launch = () => {
    launchRocketAudio.currentTime = 0.0;
    launchRocketAudio.volume = 0.5;
    launchRocketAudio.play();
  };
  const pause = () => {
    launchRocketAudio.pause();
  };
  const explode = () => {
    let click = rocketExplodeAudio.cloneNode();
    click.volume = 0.5;
    click.play();
  };
  return { launch, pause, explode };
}

//* ENERGY BAR
const overheatWarningAudio = new Audio("../assets/sounds/(overheatBeep).ogg");
const overheatAudio = new Audio("../assets/sounds/(overheat).ogg");

function energyEffects() {
  const warning = () => {
    overheatWarningAudio.currentTime = 0;
    overheatWarningAudio.volume = 0.3;
    overheatWarningAudio.play();
  };
  const expired = () => {
    overheatAudio.currentTime = 0;
    overheatAudio.volume = 0.3;
    overheatAudio.play();
  };
  return { warning, expired };
}

//* AIRPLANE
const airplaneShoot1Audio = new Audio("../assets/sounds/airplane-shoot-1.mp3");
const airplaneExplodeAudio = new Audio("../assets/sounds/airplane-explode-3.mp3");
const noEnergyAudio = new Audio("../assets/sounds/no-energy-sound.wav");

function airplaneEffects() {
  const play = () => {
    // const effects = [airplaneShoot1Audio, airplaneShoot2Audio];
    // const random = effects[Math.floor(Math.random() * effects.length)];
    let click = airplaneShoot1Audio.cloneNode();
    click.volume = 0.2;
    click.play();
  };
  const explode = () => {
    airplaneExplodeAudio.currentTime = 0;
    airplaneExplodeAudio.volume = 0.35;
    airplaneExplodeAudio.play();
  };
  const noEnergy = () => {
    let click = noEnergyAudio.cloneNode();
    click.volume = 0.25;
    click.play();
  };
  return { play, explode, noEnergy };
}

//* USER INTERFACE
const uiAudio = new Audio("../assets/sounds/interface_sound.wav");
function uiEffects() {
  const play = () => {
    let click = uiAudio.cloneNode();
    click.volume = 0.2;
    click.play();
  };
  return { play };
}

//* POWER UPS
const giftAudio = new Audio("../assets/sounds/power-up.mp3");
const coinAudio = new Audio("../assets/sounds/coin.mp3");
function giftEffects() {
  const play = () => {
    giftAudio.currentTime = 0;
    giftAudio.volume = 0.3;
    giftAudio.play();
  };
  const coin = () => {
    coinAudio.currentTime = 0;
    coinAudio.volume = 1;
    coinAudio.play();
  };
  return { play, coin };
}

//* ASTEROIDS
const hitAsteroidAudio = new Audio("../assets/sounds/hit-asteroid.wav");
function asteroidEffects() {
  const explode = () => {
    hitAsteroidAudio.currentTime = 0;
    hitAsteroidAudio.volume = 0.5;
    hitAsteroidAudio.play();
  };
  return { explode };
}

//* LOAD EFFECTS
function loadEffects() {
  const allSounds = [
    launchRocketAudio,
    rocketExplodeAudio,
    overheatWarningAudio,
    overheatAudio,
    airplaneShoot1Audio,
    airplaneExplodeAudio,
    noEnergyAudio,
    uiAudio,
    giftAudio,
    coinAudio,
    hitAsteroidAudio,
  ];
  //* Preload effects (performance)
  allSounds.forEach((sound) => {
    sound.preload = "auto";
    sound.load();
  });
}
loadEffects();

export { rocketEffects, energyEffects, airplaneEffects, uiEffects, giftEffects, asteroidEffects };
