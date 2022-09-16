export default class toggleActive {
  constructor(elements, activeClass) {
    this.elements = document.querySelectorAll(elements);
    this.activeClass = activeClass;
    this.handleActive = this.handleActive.bind(this);
  }

  handleActive(e) {
    e.preventDefault();

    this.elements.forEach((i) => i.classList.remove(this.activeClass))
    e.currentTarget.classList.add(this.activeClass);
  }

  addEvent() {
    this.elements.forEach((i) => i.addEventListener('click', this.handleActive))
  }

  init() {
    this.addEvent();

    return this;
  }
}