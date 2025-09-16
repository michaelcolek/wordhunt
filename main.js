var g;
var dev = false;
document.addEventListener("DOMContentLoaded", (e) => {
  if (document.location.search) {
    var p = new URLSearchParams(document.location.search);
    p = atob(p.get("g"));
    p = p.split("");
    g = new Game({ letters: p, time: 80, score: 0, words: [] }, true);
    console.log(p);
  } else {
    if (localStorage.game == undefined) {
    } else {
      var game = JSON.parse(localStorage.game);
      if (
        window.confirm(
          "You had a game previously, would you like to load that one?"
        )
      ) {
        landing.classList.add("hide");
        g = new Game(game, game.multiplayer);
      }
    }
  }
});
class Game {
  constructor(game, multiplayer) {
    // if (board) this.board = board; else
    this.board = [];
    if (game == undefined) {
      this.time = 80;
      this.score = 0;
      this.words = [];
      this.genletters();
    } else {
      //   if (game.multiplayer) {
      //   }
      for (let r = 0; r < 4; r++) {
        var row = [];
        for (let c = 0; c < 4; c++) {
          row.push(game.letters[r * 4 + c]);
        }
        this.board.push(row);
      }
      this.time = game.time;
      this.score = game.score;
      this.words = game.words;
    }
    this.multiplayer = multiplayer;
    this.genboard();
    this.start();
  }
  gengame() {
    this.genboard();
  }
  genletters() {
    this.board = [];
    var pool = [];
    for (var w in weights) for (let i = 0; i < weights[w]; i++) pool.push(w);
    for (let r = 0; r < 4; r++) {
      var row = [];
      for (let c = 0; c < 4; c++) {
        row.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      this.board.push(row);
    }
  }
  genboard() {
    for (var r in this.board) {
      for (var c in this.board[r]) {
        var b = document.createElement("box");
        b.style.left = `${c * 24 + 13.75}%`;
        b.style.top = `${r * 24 + 13.75}%`;
        b.id = r * 4 + c;
        b.setAttribute("x", c);
        b.setAttribute("y", r);
        b.textContent = this.board[r][c];
        board.appendChild(b);
      }
    }
  }
  start() {
    this.quickupd();
    this.upd();
  }
  finish() {
    ending.classList.remove("hide");
    var wl = document.createElement("wordslist");
    ending.appendChild(wl);
    wl.style.top = "60%";
    var sb2 = scoreboard.cloneNode(true);
    sb2.classList.add("sb2");
    sb2.children[0].textContent = `WORDS: ${this.words.length}`;
    sb2.children[1].textContent = `SCORE: ${String(this.score).padStart(
      4,
      "0"
    )}`;
    ending.appendChild(sb2);
    var words = [...this.words].sort((a, b) => b.length - a.length);
    for (var w of words) {
      var l = document.createElement("div");
      var wo = document.createElement("span");
      wo.textContent = w.toUpperCase();
      var s = document.createElement("span");
      s.textContent = lengthvals[Math.min(8, w.length)];
      s.style.color = "white";
      s.style.right = "1vh";
      s.style.position = "absolute";
      l.appendChild(wo);
      l.appendChild(s);
      wl.appendChild(l);
    }
    var s = document.createElement("button");
    s.classList.add('share')
    s.innerHTML = "Share"
    s.onclick = () => {
      const link =
        document.location.hostname +
        document.location.pathname +
        "?g=" +
        btoa(this.board.join(""));
      share(link)
      // navigator.clipboard
      //   .writeText(link)
      //   .then(() => {
      //     alert("Link copied to clipboard!");
      //   })
      //   .catch((err) => {
      //     console.error("Failed to copy: ", err);
      //   });
    };
    document.body.appendChild(s)
    localStorage.removeItem("game");
  }
  clearPath() {
    while (document.querySelectorAll("box.sel").length > 0)
      document.querySelectorAll("box.sel")[0].classList.remove("sel");
    while (document.querySelectorAll("box.cor").length > 0)
      document.querySelectorAll("box.cor")[0].classList.remove("cor");
    while (document.querySelectorAll("box.alr").length > 0)
      document.querySelectorAll("box.alr")[0].classList.remove("alr");
    this.path = [];
    clearPath();
  }
  startPath(el) {
    this.clearPath();
    this.path.push(el);
    el.classList.add("sel");
    var t = document.createElement("div");
    t.classList.add("tag");
    t.innerHTML = el.textContent;
    cont.appendChild(t);
    drawPath(this.path);
  }
  extendPath(el) {
    var t =
      document.getElementsByClassName("tag")[
        document.getElementsByClassName("tag").length - 1
      ];
    while (document.getElementsByClassName("cor").length > 0)
      document.getElementsByClassName("cor")[0].classList.remove("cor");
    while (document.getElementsByClassName("alr").length > 0)
      document.getElementsByClassName("alr")[0].classList.remove("alr");
    if (this.path.includes(el)) {
      while (this.path.length - 1 > this.path.indexOf(el)) {
        this.path.pop().classList.remove("sel");
      }
      var word = this.path.map((t) => t.textContent.trim()).join("");
      if (this.words.includes(word.toLowerCase())) {
        document
          .querySelectorAll(".sel")
          .forEach((s) => s.classList.add("alr"));
        t.classList.add("alr");
      } else if (words.includes(word.toLowerCase())) {
        document
          .querySelectorAll(".sel")
          .forEach((s) => s.classList.add("cor"));
        t.classList.add("cor");
      }
    } else {
      this.path.push(el);
      if (!el.classList.contains("sel")) el.classList.add("sel");
      if (this.path.length > 2) {
        var word = this.path.map((t) => t.textContent.trim()).join("");
        if (this.words.includes(word.toLowerCase())) {
          document
            .querySelectorAll(".sel")
            .forEach((s) => s.classList.add("alr"));
          t.classList.add("alr");
        } else if (words.includes(word.toLowerCase())) {
          document
            .querySelectorAll(".sel")
            .forEach((s) => s.classList.add("cor"));
          t.classList.add("cor");
        }
      }
    }
    var word = this.path.map((t) => t.textContent.trim()).join("");
    t.innerHTML =
      word.length < 3 ||
      !words.includes(word.toLowerCase()) ||
      this.words.includes(word.toLowerCase())
        ? word
        : `${word}&nbsp;(+${lengthvals[Math.min(8, word.length)]})`;
    drawPath(this.path);
  }
  endPath() {
    const result = this.path;
    const word = result.map((b) => b.textContent.trim()).join("");
    var t =
      document.getElementsByClassName("tag")[
        document.getElementsByClassName("tag").length - 1
      ];
    if (words.includes(word.toLowerCase())) {
      if (!this.words.includes(word.toLowerCase())) {
        this.words.push(word.toLowerCase());
        this.score += lengthvals[Math.min(8, word.length)];
        t.classList.add("fade");
        setTimeout(() => {
          t.remove();
        }, 500);
      } else t.remove();
      this.quickupd();
    } else t.remove();
    this.clearPath();
    return result;
  }
  getcoords(el) {
    return { x: Number(el.getAttribute("x")), y: Number(el.getAttribute("y")) };
  }
  quickupd() {
    wordcount.textContent = `WORDS: ${this.words.length}`;
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        let s = "";
        for (let i = 0; i < String(this.score).length; i++)
          s += Math.floor(Math.random() * 10);
        scorecount.textContent = `SCORE: ${s.padStart(4, "0")}`;
      }, i * 20);
    }
    setTimeout(() => {
      scorecount.textContent = `SCORE: ${String(this.score).padStart(4, "0")}`;
    }, 201);
  }
  upd() {
    this.time--;
    var letters = "";
    for (var r in this.board) for (var c of this.board[r]) letters += c;
    if (!dev)
      localStorage.game = JSON.stringify({
        letters: letters,
        multiplayer: this.multiplayer,
        score: this.score,
        words: this.words,
        time: this.time,
      });
    timer.textContent = `0${Math.floor(this.time / 60)}:${String(
      this.time % 60
    ).padStart(2, "0")}`;
    if (this.time == 10) {
      tick.play();
    }
    if (this.time > 0)
      setTimeout(() => {
        this.upd();
      }, 1000);
    else this.finish();
  }
}
(function wireDrag() {
  let dragging = false;
  let activePointerId = null;
  function getBoxFromEvent(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    return el?.closest?.("box");
  }

  document.getElementById("board").addEventListener("pointerdown", (e) => {
    const box = e.target.closest("box");
    if (!box) return;
    dragging = true;
    activePointerId = e.pointerId;
    board.setPointerCapture(e.pointerId);
    e.preventDefault();
    g.startPath(box);
    // console.log(box);
  });
  document.getElementById("board").addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== activePointerId) return;
    e.preventDefault();
    const box = getBoxFromEvent(e);
    if (!box || !board.contains(box)) return;
    const last = g.path[g.path.length - 1];
    if (
      box !== last &&
      Math.abs(g.getcoords(box).x - g.getcoords(last).x) <= 1 &&
      Math.abs(g.getcoords(box).y - g.getcoords(last).y) <= 1
    ) {
      g.extendPath(box);
    }
  });
  function finish(e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    e.preventDefault();
    board.releasePointerCapture(e.pointerId);
    dragging = false;
    activePointerId = null;
    const boxes = g.endPath();
    const letters = boxes.map((b) => b.textContent.trim()).join("");
    // console.log(letters);
  }
  board.addEventListener("pointerup", finish, { passive: false });
  board.addEventListener("pointercancel", finish, { passive: false });
})();
let pathLine = null;
const ro = new ResizeObserver(() => {
  const r = board.getBoundingClientRect();
  pathlayer.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
});
ro.observe(board);
function centerOf(el) {
  const br = board.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return {
    x: (er.left + er.right) / 2 - br.left,
    y: (er.top + er.bottom) / 2 - br.top,
  };
}
function drawPath(els) {
  if (!pathLine) {
    pathLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    pathLine.classList.add("pathline");
    pathlayer.appendChild(pathLine);
  }
  const pts = els
    .map((el) => {
      const { x, y } = centerOf(el);
      return `${x},${y}`;
    })
    .join(" ");
  pathLine.setAttribute("points", pts);
}
function clearPath() {
  if (pathLine) pathLine.setAttribute("points", "");
  //   if (endDot) endDot.style.display = 'none';
}
if (dev) {
  var g = new Game();
  landing.classList.add("hide");
  g.words = ["water", "magic", "tether", "ninja", "tea", "bush"];
  g.score = 4300;
  g.finish();
}
function share(url) {
  const shareData = {
    title: "WordHunt",
    url: url
  }
  if (navigator.share) {
    navigator.share(shareData).then(() => console.log("Shared Successfully")).catch(err => console.error("Error sharing:", err))
  }
}