import "./theme.css";
import "./style.css";
import { calculateDrawState, handleFileSelect, redraw } from "./editor.js";
import Slider from "./Slider";

const SliderContainer = document.querySelector("main .editor .controls");
const ChooseButton = document.querySelector("main header .choose-btn");
const FileInput = document.getElementById("fileInput");
const canvas = document.querySelector(".image-preview canvas");
const ctx = canvas.getContext("2d");

const params = {
  brightness: {
    value: 100,
    min: 0,
    max: 100,
    label: "Brightness",
  },
  contrast: {
    value: 50,
    min: 0,
    max: 100,
    label: "Contrast",
  },
  exposure: {
    value: 50,
    min: 0,
    max: 100,
    label: "Exposure",
  },
  saturation: {
    value: 50,
    min: 0,
    max: 100,
    label: "Saturation",
  },
  hueRotation: {
    value: 0,
    min: 0,
    max: 100,
    label: "Hue Rotation",
  },
  blur: {
    value: 0,
    min: 0,
    max: 100,
    label: "Blur",
  },
  grayscale: {
    value: 0,
    min: 0,
    max: 100,
    label: "Grayscale",
  },
  sepia: {
    value: 0,
    min: 0,
    max: 100,
    label: "Sepia",
  },
  invert: {
    value: 0,
    min: 0,
    max: 100,
    label: "Invert",
  },
  opacity: {
    value: 100,
    min: 0,
    max: 100,
    label: "Opacity",
  },
};

const gui = new Slider({
  title: "Filters",
  container: SliderContainer,
});

for (const item in params) {
  gui.add(params, item);
}

gui.onUpdate = () => {
  console.log('Update')
  redraw(canvas,ctx,params)
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateDrawState(canvas)
  redraw(canvas, ctx, params);
}
resizeCanvas();

window.addEventListener("resize", resizeCanvas);
ChooseButton.addEventListener("click", () => {
  FileInput.click();
});
FileInput.addEventListener("change", (e) => {
  handleFileSelect(e.target.files[0], canvas, ctx, params);
});
