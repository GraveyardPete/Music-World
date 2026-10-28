/*
  https://medium.com/@nicholasepps03/how-to-create-an-image-slider-using-html-css-js-fde4a6b4a62a
  dito ko nakuha
*/

const imgs = document.querySelectorAll('[data-img-url]');
const slider = document.querySelector('.slider');
const indexButtons = document.querySelectorAll('.index-container > button');
const navContainer = document.querySelector('.nav-container');

imgs.forEach(img => {
  img.style.backgroundImage = `url(./${img.dataset.imgUrl})`;
});

let currIndex = 0;
let slideTimer;

function slide(index) {
  currIndex = (index + imgs.length) % imgs.length;

  slider.style.transform = `translateX(-${currIndex * 100 / imgs.length}%)`;

  indexButtons.forEach((button, i) => {
    button.style.backgroundColor = i === currIndex ? 'white' : '';
  });
}

indexButtons.forEach((button, index) => {
  button.addEventListener('click', () => slide(index));
});

document.querySelectorAll('[data-index-change]').forEach(button => {
  button.addEventListener('click', () => {
    slide(currIndex + Number(button.dataset.indexChange));
  });
});

function startAutoSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => slide(currIndex + 1), 5000);
}

function stopAutoSlide() {
  clearInterval(slideTimer);
}

navContainer.addEventListener('mouseenter', stopAutoSlide);
navContainer.addEventListener('mouseleave', startAutoSlide);

document.addEventListener('touchstart', event => {
  if (!navContainer.contains(event.target)) startAutoSlide();
});

slide(0);
startAutoSlide();