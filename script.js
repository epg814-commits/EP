const slider = document.getElementById("slider");
const slides = Array.from(document.querySelectorAll(".slide"));
const navBtns = Array.from(document.querySelectorAll(".navBtn"));
const brandBtn = document.querySelector(".brand");
const navHint = document.getElementById("navHint");

let index = 0;
let isLocked = false;
let wheelAccum = 0;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function setActiveNav() {
  navBtns.forEach((b) => b.classList.remove("active"));
  const active = navBtns.find((b) => Number(b.dataset.jump) === index);
  if (active) active.classList.add("active");
}

function goTo(i) {
  index = clamp(i, 0, slides.length - 1);
  slider.style.transform = `translateX(-${index * 100}vw)`;
  setActiveNav();

  // hide hint after first navigation
  if (navHint) navHint.style.opacity = "0";
}

function lock(ms = 900) {
  isLocked = true;
  window.setTimeout(() => (isLocked = false), ms);
}

/* --- Wheel / trackpad navigation (one scroll = one slide) --- */
window.addEventListener(
  "wheel",
  (e) => {
    // If viewer is open, ignore wheel
    if (viewer.classList.contains("open")) return;

    // Prevent the “double scroll” trackpad effect
    e.preventDefault();

    if (isLocked) return;

    wheelAccum += e.deltaY;

    const THRESH = 60; // tune this if needed
    if (Math.abs(wheelAccum) < THRESH) return;

    if (wheelAccum > 0) goTo(index + 1);
    else goTo(index - 1);

    wheelAccum = 0;
    lock(900);
  },
  { passive: false }
);

/* --- Keyboard navigation --- */
window.addEventListener("keydown", (e) => {
  if (viewer.classList.contains("open")) {
    if (e.key === "Escape") closeViewer();
    return;
  }

  if (e.key === "ArrowRight") { goTo(index + 1); lock(500); }
  if (e.key === "ArrowLeft")  { goTo(index - 1); lock(500); }
});

/* --- Nav clicks --- */
navBtns.forEach((btn) => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.jump)));
});
if (brandBtn) brandBtn.addEventListener("click", () => goTo(0));

/* --- Fullscreen viewer (click tile to open, click to close) --- */
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const viewerClose = document.getElementById("viewerClose");

function openViewer(src, alt = "") {
  viewerImg.src = src;
  viewerImg.alt = alt;
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
}

function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  // clear after transition for cleanliness
  window.setTimeout(() => {
    viewerImg.src = "";
    viewerImg.alt = "";
  }, 200);
}

document.querySelectorAll(".tile img").forEach((img) => {
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    // Toggle behavior: click to open, click again (in viewer) to close
    openViewer(img.src, img.alt || "");
  });
});

viewer.addEventListener("click", closeViewer);
viewerImg.addEventListener("click", closeViewer);
viewerClose.addEventListener("click", (e) => {
  e.stopPropagation();
  closeViewer();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && viewer.classList.contains("open")) closeViewer();
});

/* Init */
goTo(0);
