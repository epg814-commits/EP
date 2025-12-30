/* =========================
   Portfolio Slides + Gallery
   ========================= */

const slidesEl = document.getElementById("slides");
const viewportEl = document.getElementById("viewport");
const navButtons = Array.from(document.querySelectorAll(".nav__btn"));
const dotsEl = document.getElementById("dots");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

const SLIDE_COUNT = 6;
let current = 0;
let isAnimating = false;

/* ---------- Data ---------- */
/* NOTE: These must match your /images/ filenames exactly. */
const DATA = {
  logos: [
    { src: "images/logo-1.webp", label: "Salted Mill" },
    { src: "images/logo-2.webp", label: "Keenan Self Storage" },
    { src: "images/logo-3.webp", label: "Fire Tigers" },
    { src: "images/logo-4.webp", label: "Seasons Finishing" },
    { src: "images/logo-5.webp", label: "Latinx Club" },
    { src: "images/logo-6.webp", label: "Helm" },
    { src: "images/logo-7.webp", label: "CMC" },
  ],
  web: [
    { src: "images/CMC.webp", label: "CMC" },
    { src: "images/DCF.webp", label: "DCF Sorting Hat" },
    { src: "images/Shewa.webp", label: "Shewa" },
    { src: "images/TWW.webp", label: "Walla Walla" },
    { src: "images/WBM.webp", label: "WBM Ranch" },
  ],
  art: [
    { src: "images/abstract.webp", label: "Abstract Portrait" },
    { src: "images/bags.webp", label: "Birthday Bags Set" },
    { src: "images/barb.webp", label: "Barb the Barbarian" },
    { src: "images/fathers.webp", label: "Father’s Day" },
    { src: "images/jesus.webp", label: "Sticker Set" },
    { src: "images/korean.webp", label: "Korean Mama Project" },
    { src: "images/osu.webp", label: "Walla Walla ♥ OSU" },
    { src: "images/photobooth.webp", label: "Photo Booth Layouts" },
    { src: "images/pride.webp", label: "Pride" },
    { src: "images/tag.webp", label: "Gift Tags" },
  ],
  prices: [
    { src: "images/prices-personal.webp", label: "Personal Website" },
    { src: "images/prices-business.webp", label: "Business Website" },
    { src: "images/prices-addons.webp", label: "Add Ons" },
    { src: "images/prices-hourly.webp", label: "Hourly" },
  ],
};

/* ---------- Gallery Builder ---------- */
function spanForIndex(i, mode) {
  // A simple asymmetrical rhythm that looks like your inspo grid.
  // Adjusted by mode so logos feel denser, web feels larger.
  if (mode === "web") return [8, 4, 6, 6, 12][i % 5];
  if (mode === "prices") return [6, 6, 6, 6][i % 4];
  if (mode === "art") return [7, 5, 6, 6, 8, 4][i % 6];
  // logos
  return [6, 6, 4, 8, 6, 6, 12][i % 7];
}

function buildGallery(containerId, items, mode) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const frag = document.createDocumentFragment();

  items.forEach((item, i) => {
    const span = spanForIndex(i, mode);
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `tile span-${span}`;
    tile.setAttribute("aria-label", `Open ${item.label}`);
    tile.dataset.full = item.src;
    tile.dataset.caption = item.label;

    const img = document.createElement("img");
    img.className = "tile__img";
    img.src = item.src;
    img.alt = item.label;
    img.loading = "lazy";

    const label = document.createElement("div");
    label.className = "tile__label";
    label.innerHTML = `<span>${item.label}</span><span class="tile__hint">Click to expand</span>`;

    tile.appendChild(img);
    tile.appendChild(label);

    tile.addEventListener("click", () => openModal(item.src, item.label));
    frag.appendChild(tile);
  });

  el.innerHTML = "";
  el.appendChild(frag);
}

/* ---------- Modal ---------- */
function openModal(src, caption) {
  modalImg.src = src;
  modalImg.alt = caption || "";
  modalCaption.textContent = caption || "";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  modalCaption.textContent = "";
  document.body.style.overflow = "hidden"; // body stays hidden; slides handle scroll
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
modalClose.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

/* ---------- Dots ---------- */
function buildDots() {
  dotsEl.innerHTML = "";
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "dot" + (i === current ? " is-active" : "");
    d.setAttribute("aria-label", `Go to slide ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(d);
  }
}

function syncNav() {
  navButtons.forEach((b) => b.classList.remove("is-active"));
  const active = navButtons.find((b) => Number(b.dataset.goto) === current);
  if (active) active.classList.add("is-active");

  const dots = Array.from(document.querySelectorAll(".dot"));
  dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
}

/* ---------- Slide Navigation ---------- */
function goTo(idx) {
  if (idx < 0 || idx >= SLIDE_COUNT) return;
  if (isAnimating) return;

  current = idx;
  isAnimating = true;

  slidesEl.style.transform = `translateX(${-current * 100}vw)`;

  // reset scroll on new slide so user doesn't land mid-scroll
  const nextSlide = document.querySelector(`.slide[data-index="${current}"]`);
  if (nextSlide && nextSlide.classList.contains("slide--scroll")) {
    nextSlide.scrollTo({ top: 0, behavior: "instant" });
  }

  syncNav();
  setTimeout(() => (isAnimating = false), 700);
}

/* Hook nav buttons + hero CTA */
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.goto)));
});
document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.goto)));
});

/* ---------- Wheel/Trackpad Behavior ----------
   Goal:
   - Horizontal slide navigation by trackpad (deltaX)
   - Vertical scroll inside gallery slides
   - Still allow "slide to next" when user hits top/bottom of a scroll slide
---------------------------------------------- */
function getActiveSlideEl() {
  return document.querySelector(`.slide[data-index="${current}"]`);
}

function canScrollVertically(slideEl) {
  if (!slideEl) return false;
  return slideEl.classList.contains("slide--scroll") && slideEl.scrollHeight > slideEl.clientHeight + 2;
}

function atScrollEdge(slideEl, direction) {
  // direction: 1 = down, -1 = up
  const top = slideEl.scrollTop;
  const max = slideEl.scrollHeight - slideEl.clientHeight;
  if (direction > 0) return top >= max - 1;
  return top <= 1;
}

let wheelLock = false;
let wheelTimer = null;

window.addEventListener(
  "wheel",
  (e) => {
    if (modal.classList.contains("is-open")) return;

    const slideEl = getActiveSlideEl();
    const scrollable = canScrollVertically(slideEl);

    const dx = e.deltaX;
    const dy = e.deltaY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // If user is clearly doing a horizontal gesture, navigate slides.
    const horizontalIntent = absX > 20 && absX > absY * 1.1;

    // Otherwise, treat dy as slide navigation ONLY when:
    // - current slide is not scrollable OR
    // - current slide is scrollable but user is at top/bottom edge
    const verticalNavigateAllowed =
      !scrollable ||
      (scrollable && atScrollEdge(slideEl, dy > 0 ? 1 : -1));

    if (wheelLock) {
      e.preventDefault();
      return;
    }

    if (horizontalIntent) {
      e.preventDefault();
      wheelLock = true;
      if (dx > 0) goTo(current + 1);
      else goTo(current - 1);
    } else if (verticalNavigateAllowed) {
      // Only intercept if dy is meaningful (prevents tiny trackpad jitter)
      if (absY > 30) {
        e.preventDefault();
        wheelLock = true;
        if (dy > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    } else {
      // Let the slide scroll normally
      return;
    }

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => (wheelLock = false), 650);
  },
  { passive: false }
);

/* ---------- Touch Swipe (mobile) ---------- */
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
  if (modal.classList.contains("is-open")) return;
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (modal.classList.contains("is-open")) return;

  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // prioritize horizontal swipe
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.1) {
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  }
}, { passive: true });

/* ---------- Contact Form (mailto for GitHub Pages) ---------- */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const type = form.type.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Inquiry: ${type} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nType: ${type}\n\nMessage:\n${message}\n`
  );

  // Change to your preferred email if needed
  window.location.href = `mailto:EPG814@gmail.com?subject=${subject}&body=${body}`;
});

/* ---------- Init ---------- */
buildGallery("gallery-logos", DATA.logos, "logos");
buildGallery("gallery-web", DATA.web, "web");
buildGallery("gallery-art", DATA.art, "art");
buildGallery("gallery-prices", DATA.prices, "prices");

buildDots();
syncNav();
goTo(0);
