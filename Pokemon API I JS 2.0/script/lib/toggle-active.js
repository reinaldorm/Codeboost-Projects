export default class Toggle {
  constructor(elements, activeClass, config) {
    this.elements = document.querySelectorAll(elements);
    this.activeClass = activeClass;
    this.handleActive = this.handleActive.bind(this);
    this.config = config || false
  }

  handleActive(e) {
    e.preventDefault();

    if (this.config) {
      e.currentTarget.classList.toggle(this.activeClass);
    } else {
      this.elements.forEach((i) => i.classList.remove(this.activeClass))
      e.currentTarget.classList.add(this.activeClass);
    }
  }

  addEvent() {
    this.elements.forEach((i) => i.addEventListener('click', this.handleActive))
  }

  init() {
    this.addEvent();

    return this;
  }
}