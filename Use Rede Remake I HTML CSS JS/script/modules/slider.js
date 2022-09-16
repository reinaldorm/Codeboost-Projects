export default class Slider {
  constructor(up, down, sliderItem, activeClass) {
    this.active = 0;
    this.activeClass = activeClass;
    this.up = document.querySelector(up);
    this.down = document.querySelector(down);
    this.sliderItem = [...document.querySelectorAll(sliderItem)];
  }

  handleFirst() {
    this.sliderItem[this.active].classList.add(this.activeClass);
  }

  handleReset() {
    clearInterval(this.timer);
    this.handleTimer();
  }

  handleTimer() {
    this.timer = setInterval(() => {
      this.active += 1;
      this.active = this.active >= this.sliderItem.length ? 0 : this.active;

      this.sliderItem.forEach((i) => i.classList.remove(this.activeClass));
      this.sliderItem[this.active].classList.add(this.activeClass);
    }, 8000)
  }

  handleSlide({ currentTarget }) {
    if (currentTarget.className.includes('up')) this.active -= 1;
    if (currentTarget.className.includes('down')) this.active += 1;

    this.active = this.active < 0 ? 0 : this.active;
    this.active = this.active >= this.sliderItem.length ? 0 : this.active;

    this.sliderItem.forEach((i) => i.classList.remove(this.activeClass));
    this.sliderItem[this.active].classList.add(this.activeClass);
    this.handleReset();
  }

  handleActive(e) {
    e.preventDefault();
    this.active = this.sliderItem.indexOf(e.currentTarget);

    this.sliderItem.forEach((i) => i.classList.remove(this.activeClass));
    e.currentTarget.classList.add(this.activeClass);
    this.handleReset();
  }

  addEvent() {
    this.sliderItem.forEach((i) => i.addEventListener('click', this.handleActive));
    this.up.addEventListener('click', this.handleSlide);
    this.down.addEventListener('click', this.handleSlide);
  }

  bindMeth() {
    this.handleActive = this.handleActive.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
  }

  init() {
    this.bindMeth();
    this.handleTimer();
    this.handleFirst();
    this.addEvent();

    return this;
  }
}