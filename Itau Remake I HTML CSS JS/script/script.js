const arrow = document.querySelector('.main-scroll');

const handleScroll = function (e) {
  e.preventDefault();
  window.scrollTo({
    top: window.outerHeight * .9,
    behavior: "smooth",
  })
};

arrow.addEventListener('click', handleScroll);
