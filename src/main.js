import './theme.css';
import './style.css';

import Slider from './Slider'; 

const SliderContainer = document.querySelector('main .editor .controls')

const params = {
  blur: 12,
  speed: 0.5,
  scale: 1
};

const gui = new Slider({
  title: "Controler",
  container: SliderContainer
});

gui
  .add(params, "blur", { min: 0, max: 30, step: 0.5 })
  .add(params, "speed", { min: 0, max: 5, step: 0.01 })
  .add(params, "scale", { min: 0.5, max: 2, step: 0.01 });
