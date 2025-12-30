const slider = document.getElementById("slider");
const slides = Array.from(document.querySelectorAll(".slide"));
const navBtns = Array.from(document.querySelectorAll(".navBtn"));
const brandBtn = document.querySelector(".brand");
const navHint = document.getElementById("navHint");
const ctaBtn = document.querySelector(".ctaBtn");

let index = 0;
let isLocked = false;
let wheelAccum = 0;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function setActiveNav() {
  navBtns.forEach((b) => b.classList.remove("active"));
  const active = navBtns.find((b) => Number(b.dataset.jump) === index);
  if (active) active.classList.add("active");
}

function goTo(i, { instant = false } = {}) {
  index = clamp(i, 0, slides.length - 1);

  if (instant) slider.style.transition = "none";
  slider.style.transform = `translateX(-${index * 100}vw)`;
  if (instant) {
    // force reflow then restore transition
    slider.offsetHeight; // eslint-disable-line no-unused-expressions
    slider.style.transition = "transform 900ms cubic-bezier(.2,.9,.2,1)";
  }

  setActiveNav();
  if (navHint) navHint.style.opacity = "0";
}

function lock(ms = 900) {
  isLocked = true;
  window.setTimeout(() => (isLocked = false), ms);
}

/* ---------------- FULLSCREEN VIEWER ---------------- */
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
  window.setTimeout(() => {
    viewerImg.src = "";
    viewerImg.alt = "";
  }, 200);
}

viewer.addEventListener("click", closeViewer);
viewerClose.addEventListener("click", (e) => {
  e.stopPropagation();
  closeViewer();
});

/* click tiles to open */
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const img = tile.querySelector("img");
    if (!img) return;
    openViewer(img.src, img.alt || "");
  });
});

/* Esc closes viewer */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && viewer.classList.contains("open")) closeViewer();
});

/* ---------------- WHEEL / TRACKPAD NAV ----------------
   Gallery slides scroll vertically.
   Only when the gallery is at top/bottom will we navigate horizontally.
--------------------------------------------------------- */
window.addEventListener(
  "wheel",
  (e) => {
    // if viewer open, ignore wheel
    if (viewer.classList.contains("open")) return;

    const currentSlide = slides[index];

    // If slide is scrollable, let it scroll first
    if (currentSlide.classList.contains("gallerySlide")) {
      const atTop = currentSlide.scrollTop <= 0;
      const atBottom =
        Math.ceil(currentSlide.scrollTop + currentSlide.clientHeight) >=
        currentSlide.scrollHeight;

      // If NOT at an edge, allow native vertical scroll (do not preventDefault)
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
        return;
      }
      // If at edge, we'll treat wheel as horizontal nav (preventDefault below)
    }

    // Horizontal navigation for non-scroll slides OR when at top/bottom edges
    e.preventDefault();
    if (isLocked) return;

    wheelAccum += e.deltaY;

    const THRESH = 60; // helps trackpad avoid double slide
    if (Math.abs(wheelAccum) < THRESH) return;

    if (wheelAccum > 0) goTo(index + 1);
    else goTo(index - 1);

    wheelAccum = 0;
    lock(900);
  },
  { passive: false }
);

/* keyboard navigation */
window.addEventListener("keydown", (e) => {
  if (viewer.classList.contains("open")) return;

  if (e.key === "ArrowRight") { goTo(index + 1); lock(450); }
  if (e.key === "ArrowLeft")  { goTo(index - 1); lock(450); }
});

/* nav jumps */
navBtns.forEach((btn) => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.jump)));
});
if (brandBtn) brandBtn.addEventListener("click", () => goTo(0));
if (ctaBtn) ctaBtn.addEventListener("click", () => goTo(Number(ctaBtn.dataset.jump)));

/* init */
goTo(0, { instant: true });
