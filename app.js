// app.js — Swiper + menu + lightbox (Surface Pro trackpad-safe)

const menuLinks = Array.from(document.querySelectorAll(".menu__link"));

let wheelCooldown = false;

const swiper = new Swiper("#siteSlider", {
  direction: "horizontal",
  slidesPerView: 1,
  speed: 900,

  keyboard: { enabled: true },
  pagination: { el: ".swiper-pagination", clickable: true },

  // Trackpad/wheel tuning (Windows Precision touchpads can burst deltas)
  mousewheel: {
    forceToAxis: true,
    sensitivity: 0.35,
    thresholdDelta: 60,
    thresholdTime: 400,
  },

  preventInteractionOnTransition: true,

  on: {
    init() {
      setActiveMenu(this.activeIndex);
    },
    slideChange() {
      setActiveMenu(this.activeIndex);
    },

    // Lock wheel whenever a transition begins to prevent “double slide”
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

  swiper.mousewheel.disable();

  setTimeout(() => {
    swiper.mousewheel.enable();
    wheelCooldown = false;
  }, 350);
}

// Menu jump
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

// Lightbox
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
  lightbox.close();
  lightboxImg.src = "";
  lightboxImg.alt = "";
  if (lightboxCap) lightboxCap.textContent = "";
}

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

lightboxClose?.addEventListener("click", closeLightbox);

// Click outside image closes
lightbox?.addEventListener("click", (e) => {
  const rect = lightboxImg.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;

  if (!inside) closeLightbox();
});

// Clear src on ESC close
lightbox?.addEventListener("close", () => {
  lightboxImg.src = "";
});
