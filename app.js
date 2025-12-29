// app.js — Surface Pro trackpad friendly Swiper + menu + lightbox

// ===== Swiper (prevents “double slide” on precision touchpads) =====
const menuLinks = Array.from(document.querySelectorAll(".menu__link"));

let wheelCooldown = false;

const swiper = new Swiper("#siteSlider", {
  direction: "horizontal",
  slidesPerView: 1,
  speed: 900,

  keyboard: { enabled: true },
  pagination: { el: ".swiper-pagination", clickable: true },

  // Trackpad / wheel tuning (Windows Precision touchpads often burst deltas)
  mousewheel: {
    forceToAxis: true,
    sensitivity: 0.35,  // lower = less aggressive
    thresholdDelta: 60, // ignore small jitter deltas
    thresholdTime: 400, // require time between distinct gestures
  },

  // Avoid interactions during transitions
  preventInteractionOnTransition: true,

  on: {
    init() {
      setActiveMenu(this.activeIndex);
    },

    slideChange() {
      setActiveMenu(this.activeIndex);
    },

    // Lock wheel whenever a slide transition begins (prevents double-advance)
    slideNextTransitionStart() {
      lockWheel();
    },
    slidePrevTransitionStart() {
      lockWheel();
    },
  },
});

function lockWheel() {
  if (wheelCooldown) return;
  wheelCooldown = true;

  // Temporarily disable wheel input during/after the transition
  swiper.mousewheel.disable();

  // Cooldown: tweak 250–500 if you want it snappier/slower
  setTimeout(() => {
    swiper.mousewheel.enable();
    wheelCooldown = false;
  }, 350);
}

// ===== Menu jump =====
menuLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const i = Number(btn.dataset.slide);
    if (Number.isFinite(i)) swiper.slideTo(i);
  });
});

function setActiveMenu(index) {
  menuLinks.forEach((btn) => btn.setAttribute("aria-current", "false"));
  const active = menuLinks.find((b) => Number(b.dataset.slide) === index);
  if (active) active.setAttribute("aria-current", "true");
}

// ===== Lightbox (gallery expand) =====
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImg");
const lightboxCap = document.querySelector("#lightboxCap");
const lightboxClose = document.querySelector("#lightboxClose");

function openLightbox({ src, alt, caption }) {
  if (!src) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Expanded image";
  if (lightboxCap) lightboxCap.textContent = caption || alt || "";
  if (typeof lightbox.showModal === "function") lightbox.showModal();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.close();
  // Clear heavy assets for mobile/perf
  lightboxImg.src = "";
  lightboxImg.alt = "";
  if (lightboxCap) lightboxCap.textContent = "";
}

// Open on tile click
document.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;

  const img = tile.querySelector("img");
  openLightbox({
    src: tile.dataset.full,
    alt: img?.alt || "",
    caption: img?.alt || "",
  });
});

// Close button
lightboxClose?.addEventListener("click", closeLightbox);

// Click outside image closes
lightbox?.addEventListener("click", (e) => {
  const rect = lightboxImg.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;

  if (!inside) closeLightbox();
});

// Ensure src clears on ESC close
lightbox?.addEventListener("close", () => {
  lightboxImg.src = "";
});
