export default class ScrollShow {
  constructor(elements) {
    this.elements = document.querySelectorAll(elements);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    this.elements.forEach((i) => {
      const windowOffset = window.scrollY;
      const windowHeight = window.outerHeight * 0.6;
      const isVisible = i.offsetTop - windowHeight < windowOffset;

      if (isVisible) i.setAttribute('data-anime', 'anime');
    })
  }

  addEvent() {
    window.addEventListener('scroll', this.handleScroll)
  }

  init() {
    this.addEvent()
    this.handleScroll()

    return this;
  }
}