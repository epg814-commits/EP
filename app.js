const sliderEl = document.querySelector("#siteSlider");
const menuLinks = Array.from(document.querySelectorAll(".menu__link"));

const swiper = new Swiper(sliderEl, {
  direction: "horizontal",
  slidesPerView: 1,
  speed: 900,
  mousewheel: { forceToAxis: true, sensitivity: 0.85 },
  keyboard: { enabled: true },
  pagination: { el: ".swiper-pagination", clickable: true },
});

function setActiveMenu(index) {
  menuLinks.forEach((btn) => btn.setAttribute("aria-current", "false"));
  const active = menuLinks.find((b) => Number(b.dataset.slide) === index);
  if (active) active.setAttribute("aria-current", "true");
}
setActiveMenu(0);

menuLinks.forEach((btn) => {
  btn.addEventListener("click", () => swiper.slideTo(Number(btn.dataset.slide)));
});
swiper.on("slideChange", () => setActiveMenu(swiper.activeIndex));

/* Lightbox */
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImg");
const lightboxCap = document.querySelector("#lightboxCap");
const lightboxClose = document.querySelector("#lightboxClose");

function openLightbox({ src, alt, caption }) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Expanded image";
  lightboxCap.textContent = caption || alt || "";
  if (typeof lightbox.showModal === "function") lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
  lightboxImg.src = "";
  lightboxImg.alt = "";
  lightboxCap.textContent = "";
}

document.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;

  const img = tile.querySelector("img");
  openLightbox({
    src: tile.dataset.full,
    alt: img?.alt,
    caption: img?.alt
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

// click outside image to close
lightbox?.addEventListener("click", (e) => {
  const rect = lightboxImg.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) closeLightbox();
});

// ESC closes automatically in <dialog>, but we also clear the src
lightbox?.addEventListener("close", () => {
  lightboxImg.src = "";
});
