// ----------------------------
// CONFIG: Update filenames here
// ----------------------------
// Put all images in /images/ (and optionally subfolders).
// If you rename files later, just update these arrays.

const GALLERIES = {
  logos: [
    // your final logos (examples — rename to match your repo)
    "images/logos/logo-1.webp",
    "images/logos/logo-2.webp",
    "images/logos/logo-3.webp",
    "images/logos/logo-4.webp",
    "images/logos/logo-5.webp",
    "images/logos/logo-6.webp",
    "images/logos/logo-7.webp",
  ],
  web: [
    "images/web/CMC.webp",
    "images/web/DCF.webp",
    "images/web/Shewa.webp",
    "images/web/TWW.webp",
    "images/web/WBM.webp",
  ],
  art: [
    "images/art/abstract.webp",
    "images/art/bags.webp",
    "images/art/barb.webp",
    "images/art/fathers.webp",
    "images/art/jesus.webp",
    "images/art/korean.webp",
    "images/art/osu.webp",
    "images/art/photobooth.webp",
    "images/art/pride.webp",
    "images/art/tag.webp",
  ],
  prices: [
    // rename suggestions: personal.webp, business.webp, addons.webp, hourly.webp (or keep yours)
    "images/prices/personal.webp",
    "images/prices/business.webp",
    "images/prices/addons.webp",
    "images/prices/hourly.webp",
  ]
};

// ----------------------------
// Slide logic
// ----------------------------
const deck = document.getElementById("deck");
const slides = Array.from(document.querySelectorAll(".slide"));
const navlinks = Array.from(document.querySelectorAll(".navlink"));

let index = 0;
let isAnimating = false;

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function setActiveNav(i){
  navlinks.forEach(a => a.classList.toggle("is-active", Number(a.dataset.slide) === i));
  document.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("is-active", idx === i));
}

function goTo(i){
  index = clamp(i, 0, slides.length - 1);
  deck.style.transform = `translateX(-${index * 100}vw)`;
  setActiveNav(index);
}

// Buttons in hero
document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.goto)));
});

// Nav click
navlinks.forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    goTo(Number(a.dataset.slide));
  });
});

// ----------------------------
// Bottom dots
// ----------------------------
const dotsEl = document.getElementById("dots");
function buildDots(){
  dotsEl.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " is-active" : "");
    d.type = "button";
    d.setAttribute("aria-label", `Go to slide ${i+1}`);
    d.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(d);
  });
}
buildDots();

// ----------------------------
// Wheel handling:
// - Horizontal wheel moves slides
// - BUT if you are scrolling inside a scrollable gallery,
//   it scrolls vertically and does NOT change slides.
// ----------------------------
function hasVerticalScroll(el){
  return el && el.scrollHeight > el.clientHeight + 2;
}

function findScrollableTarget(startEl){
  let el = startEl;
  while (el && el !== document.body){
    if (el.classList && el.classList.contains("scrollable")) return el;
    el = el.parentElement;
  }
  return null;
}

window.addEventListener("wheel", (e) => {
  const scroller = findScrollableTarget(e.target);

  // If cursor is over a scrollable area and it can scroll, let it scroll.
  if (scroller && hasVerticalScroll(scroller)) {
    // Only block slide navigation if there is room to scroll in the direction
    const atTop = scroller.scrollTop <= 0;
    const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;

    const goingDown = e.deltaY > 0;
    const goingUp = e.deltaY < 0;

    if ((goingDown && !atBottom) || (goingUp && !atTop)) {
      // allow the scroll inside gallery; don't change slides
      return;
    }
    // If you're at the edge, allow slide navigation to kick in
  }

  // Slide navigation (throttled)
  if (isAnimating) return;
  isAnimating = true;

  if (e.deltaY > 0) goTo(index + 1);
  else if (e.deltaY < 0) goTo(index - 1);

  setTimeout(() => { isAnimating = false; }, 520);
}, { passive: true });

// Keyboard navigation
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goTo(index + 1);
  if (e.key === "ArrowLeft") goTo(index - 1);
});

// ----------------------------
// Build galleries
// ----------------------------
function spanClass(i){
  // A little visual variety like your reference grid
  if (i % 7 === 0) return "span-12";
  if (i % 5 === 0) return "span-6";
  return ""; // default span-4 via CSS
}

function buildGallery(name){
  const el = document.querySelector(`[data-gallery="${name}"]`);
  if (!el) return;

  el.innerHTML = "";
  const files = GALLERIES[name] || [];

  files.forEach((src, i) => {
    const card = document.createElement("div");
    card.className = `card ${spanClass(i)}`.trim();

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${name} item ${i+1}`;
    img.loading = "lazy";

    card.appendChild(img);
    el.appendChild(card);

    card.addEventListener("click", () => openLightbox(src, img.alt));
  });
}

Object.keys(GALLERIES).forEach(buildGallery);

// ----------------------------
// Lightbox
// ----------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox(){
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ----------------------------
// Contact form: mailto (no personal info shown on page)
// ----------------------------
const contactForm = document.getElementById("contactForm");

// Change this to your email:
const DEST_EMAIL = "epg814@gmail.com";

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(contactForm);
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const service = (fd.get("service") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const subject = encodeURIComponent(`New inquiry: ${service || "Project"} (${name || "No name"})`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Service: ${service}

Details:
${message}
`
  );

  window.location.href = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;
});

// Start on slide 0
goTo(0);
