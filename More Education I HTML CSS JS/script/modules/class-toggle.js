export default class classToggle {
  constructor(elements, activeClass) {
    this.activeClass = activeClass;
    this.handleActive = this.handleActive.bind(this);
    this.elements = document.querySelectorAll(elements);
  }

  handleActive(e) {
    e.preventDefault();

    this.elements.forEach((i) => i.classList.remove(this.activeClass));
    e.currentTarget.classList.add(this.activeClass);
  }

  addEvent() {
    this.elements.forEach((i) => i.addEventListener('click', this.handleActive));
  }

  init() {
    this.addEvent();

    return this;
  }
}