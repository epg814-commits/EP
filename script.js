let index = 0;
let isScrolling = false;

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  if (e.deltaY > 0 && index < slides.length - 1) {
    index++;
  } else if (e.deltaY < 0 && index > 0) {
    index--;
  }

  slider.style.transform = `translateX(-${index * 100}vw)`;

  isScrolling = true;
  setTimeout(() => {
    isScrolling = false;
  }, 900); // matches CSS transition timing
}, { passive: true });
