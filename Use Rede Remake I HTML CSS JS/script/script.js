import Slider from './modules/slider.js'
import classToggle from './modules/class-toggle.js'

const mainSlider = new Slider('.s-main-slider-up', '.s-main-slider-down', '.s-main-slider-item', 'active');
const sectionMaquinasToggle = new classToggle('.s-maquinas-secao-item', 'active');

mainSlider.init();
sectionMaquinasToggle.init();
