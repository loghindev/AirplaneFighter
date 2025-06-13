const launchRocketAudio = new Audio("../assets/sounds/launch_rocket.wav");
const rocketExplodeAudio = new Audio("../assets/sounds/rocket_explosion.wav");
const overheatWarningAudio = new Audio("../assets/sounds/(overheatBeep).ogg");
const overheatAudio = new Audio("../assets/sounds/(overheat).ogg");

//* ROCKET BOOM
function launchRocketEffect() {
  const play = () => {
    launchRocketAudio.currentTime = 0.0;
    launchRocketAudio.volume = 0.8;
    launchRocketAudio.play();
  };
  const pause = () => {
    launchRocketAudio.pause();
  };
  return { play, pause };
}

function rocketExplosionEffect() {
  const play = () => {
    rocketExplodeAudio.currentTime = 0.1;
    rocketExplodeAudio.volume = 0.8;
    rocketExplodeAudio.play();
  };
  return { play };
}

//* ENERGY BAR
function energyWarningEffect() {
  const play = () => {
    overheatWarningAudio.currentTime = 0;
    overheatWarningAudio.volume = 0.8;
    overheatWarningAudio.play();
  };
  return { play };
}

function energyExpireEffect() {
  const play = () => {
    overheatAudio.currentTime = 0;
    overheatAudio.volume = 0.8;
    overheatAudio.play();
  };
  return { play };
}

export { launchRocketEffect, rocketExplosionEffect, energyWarningEffect, energyExpireEffect };
