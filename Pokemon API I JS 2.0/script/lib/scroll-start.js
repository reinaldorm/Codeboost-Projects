export default class Scroll {
  constructor(element, handle) {
    this.element = document.querySelector(element)
    this.handle = document.querySelector(handle)
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(e) {
    e.preventDefault();

    this.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  addEvent() {
    this.handle.addEventListener('click', this.handleScroll)
  }

  init() {
    this.addEvent()

    return this
  }
}