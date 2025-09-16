const tick = new Audio("assets/clocktick(10sec).mp3");
tick.preload = "auto";
tick.load();

document.addEventListener("click", () => {
  tick.muted = true;
  tick.play().then(() => {
    tick.pause();
    tick.currentTime = 0;
    tick.muted = false;
  });
}, { once: true });
const weights = {
  E: 11,
  A: 9,
  I: 9,
  O: 8,
  N: 6,
  R: 6,
  T: 6,
  L: 4,
  S: 4,
  U: 4,
  D: 4,
  G: 3,
  B: 2,
  C: 2,
  M: 2,
  P: 2,
  F: 2,
  H: 2,
  V: 2,
  W: 2,
  Y: 2,
  K: 1,
  J: 1,
  X: 1,
  Q: 1,
  Z: 1,
};
const lengthvals = {
  3: 100,
  4: 400,
  5: 800,
  6: 1400,
  7: 1800,
  8: 2200,
};
var words;
fetch("words.json")
  .then((response) => response.json())
  .then((data) => {
    words = data;
  })
  .catch((error) => console.error(error));
