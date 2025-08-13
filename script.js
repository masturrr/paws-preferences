// ---- prefetch cache ----
const preloaded = new Map(); // url -> HTMLImageElement

function prefetchIndex(start, count = 3) {
  for (let i = start; i < Math.min(start + count, urls.length); i++) {
    const url = urls[i];
    if (preloaded.has(url)) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    img.onload = () => preloaded.set(url, img);
    img.onerror = () => preloaded.delete(url); // allow retry later
  }
}

// ----- configuration -----
const TOTAL_CATS = 12; // you can use 10–20 as the brief suggests
const SWIPE_THRESHOLD = 120; // pixels to accept like/dislike

// ----- state -----
let urls = [];
let index = 0;
let liked = [];

// ----- helpers -----
const $ = (sel) => document.querySelector(sel);
function updateProgress() {
  $("#progress").textContent = `${Math.min(index + 1, urls.length)} / ${urls.length}`;
}

const IMG_W = 700;
const IMG_H = 900;

// build unique image URLs from Cataas (cache-busting query)
function buildUrls(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(`https://cataas.com/cat?width=${IMG_W}&height=${IMG_H}&random=${Date.now()}-${i}`);
  }
  return out;
}

// render the top card
function renderCard() {
  const stack = $("#stack");
  stack.innerHTML = ""; // clear any previous card

  if (index >= urls.length) {
    showResults();
    return;
  }

  const url = urls[index];

  // create the card container
  const card = document.createElement("div");
  card.className = "card";

  // skeleton layer
  const skeleton = document.createElement("div");
  skeleton.className = "skeleton";
  card.appendChild(skeleton);

  // create the image element
  const img = document.createElement("img");
  img.alt = `Cat ${index + 1}`;
  img.src = url;

  // fade-in effect once image is loaded
  img.onload = () => {
    img.classList.add("loaded");
    skeleton.remove(); // remove skeleton after load
  };

  // if load fails, remove skeleton so user isn't stuck
  img.onerror = () => {
    skeleton.remove();
  };

  card.appendChild(img);

  // like/dislike badges
  card.insertAdjacentHTML("beforeend", `
    <span class="badge like" style="opacity:0">LIKE</span>
    <span class="badge nope" style="opacity:0">NOPE</span>
  `);

  // add card to stack
  stack.appendChild(card);

  // enable swipe gestures
  attachDrag(card);

  updateProgress();
}

// drag/swipe with pointer events (works on mouse + touch)
function attachDrag(card) {
  let startX = 0, currentX = 0, dragging = false;

  const likeBadge = card.querySelector(".badge.like");
  const nopeBadge = card.querySelector(".badge.nope");

  const onDown = (e) => {
    dragging = true;
    startX = getX(e);
    card.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!dragging) return;
    currentX = getX(e) - startX;
    const rotate = currentX / 16;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

    // show hint badges
    const t = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1);
    likeBadge.style.opacity = currentX > 0 ? t : 0;
    nopeBadge.style.opacity = currentX < 0 ? t : 0;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;

    if (currentX > SWIPE_THRESHOLD) {
      fling(card, +1); // like
    } else if (currentX < -SWIPE_THRESHOLD) {
      fling(card, -1); // dislike
    } else {
      // snap back
      card.style.transition = "transform .2s";
      card.style.transform = "";
      likeBadge.style.opacity = 0;
      nopeBadge.style.opacity = 0;
      setTimeout(() => (card.style.transition = ""), 200);
    }
    currentX = 0;
  };

  card.addEventListener("pointerdown", onDown);
  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerup", onUp);
  card.addEventListener("pointercancel", onUp);
}

function getX(e) { return e.touches?.[0]?.clientX ?? e.clientX ?? 0; }

function fling(card, dir) {
  // dir: +1 like, -1 dislike
  card.style.transition = "transform .25s ease-out, opacity .25s";
  card.style.transform = `translateX(${dir * 1000}px) rotate(${dir * 30}deg)`;
  card.style.opacity = "0";
  setTimeout(() => {
    if (dir > 0) liked.push(urls[index]);
    index++;
    renderCard();
  }, 220);
}

// buttons
$("#like").addEventListener("click", () => fling(document.querySelector(".card"), +1));
$("#nope").addEventListener("click", () => fling(document.querySelector(".card"), -1));
$("#restart").addEventListener("click", () => start());

function showResults() {
  // Hide the swipe UI completely
  $("#stack").style.display = "none";
  $(".actions").style.display = "none";
  $("#progress").style.display = "none";

  // Show results as full page
  const res = $("#results");
  res.classList.remove("hidden");
  res.style.display = "block"; // make sure it's visible

  // Fill in results content
  $("#summary").textContent = `You liked ${liked.length} out of ${urls.length} cats.`;
  const grid = $("#likedGrid");
  grid.innerHTML = liked
    .map(u => `<img src="${u}" alt="Liked cat">`)
    .join("");
}

function start() {
  urls = buildUrls(TOTAL_CATS);
  index = 0;
  liked = [];

  // Show swipe UI again
  $("#stack").style.display = "block";
  $(".actions").style.display = "flex";
  $("#progress").style.display = "block";

  // Hide results page
  $("#results").classList.add("hidden");
  $("#results").style.display = "none";

  renderCard();
}

start();