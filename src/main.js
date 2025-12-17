import './theme.css';
import './style.css';

import Slider from './Slider'; 

const SliderContainer = document.querySelector('main .editor .controls')

const params = {
  brightness: {
    value:50,
    min:0,
    max:100,
    label:'Brightness'
  },
  contrast:{
    value:50,
    min:0,
    max:100,
    label:'Contrast'
  },
  exposure:{
    value:50,
    min:0,
    max:100,
    label:'Exposure'
  },
  saturation:{
    value:50,
    min:0,
    max:100,
    label:'Saturation'
  },
  hueRotation:{
    value:0,
    min:0,
    max:100,
    label:'Hue Rotation'
  },
  blur:{
    value:0,
    min:0,
    max:100,
    label:'Blur'
  },
  grayscale:{
    value:0,
    min:0,
    max:100,
    label:'Grayscale'
  },
  sepia:{
    value:0,
    min:0,
    max:100,
    label:'Sepia'
  },
  invert:{
    value:0,
    min:0,
    max:100,
    label:'Invert'
  },
  opacity:{
    value:100,
    min:0,
    max:100,
    label:'Opacity'
  },
};

const gui = new Slider({
  title: "Filters",
  container: SliderContainer
});


for(const item in params) {
  gui.add(params,item)
}
