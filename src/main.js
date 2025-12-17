import "./theme.css";
import "./style.css";

import {
  PRESETS,
  applyPresetByName,
  calculateDrawState,
  downloadCanvas,
  handleFileSelect,
  redraw,
  renderPresetButtons,
} from "./editor.js";

import Slider from "./Slider";

/* ===============================
   DOM References
================================ */
const SliderContainer = document.querySelector("main .editor .controls");
const ChooseButton = document.querySelector("main header .choose-btn");
const ResetButton = document.querySelector("main header .reset-btn");
const SaveButton = document.querySelector("main header .save-btn");
const FileInput = document.getElementById("fileInput");
const canvas = document.querySelector(".image-preview canvas");
const ctx = canvas.getContext("2d");

/* ===============================
   Params
================================ */
const params = {
  brightness: { value: 100, min: 0, max: 100, label: "Brightness" },
  contrast: { value: 50, min: 0, max: 100, label: "Contrast" },
  saturation: { value: 50, min: 0, max: 100, label: "Saturation" },
  hueRotation: { value: 0, min: 0, max: 100, label: "Hue Rotation" },
  blur: { value: 0, min: 0, max: 100, label: "Blur" },
  grayscale: { value: 0, min: 0, max: 100, label: "Grayscale" },
  sepia: { value: 0, min: 0, max: 100, label: "Sepia" },
  invert: { value: 0, min: 0, max: 100, label: "Invert" },
  opacity: { value: 100, min: 0, max: 100, label: "Opacity" },
};

/* ===============================
   Slider UI
================================ */
const gui = new Slider({
  title: "Filters",
  container: SliderContainer,
});

for (const key in params) {
  gui.add(params, key);
}

/* When sliders change → redraw */
gui.onUpdate = () => {
  redraw(canvas, ctx, params);
};

/* ===============================
   Presets UI
================================ */
renderPresetButtons({
  presets: PRESETS,
  params,
  canvas,
  ctx,
  redraw,
});

/* ===============================
   Canvas Resize
================================ */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateDrawState(canvas);
  redraw(canvas, ctx, params);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ===============================
   Header Buttons
================================ */
SaveButton.addEventListener("click", () => {
  downloadCanvas(canvas);
});

ChooseButton.addEventListener("click", () => {
  FileInput.click();
});

ResetButton.addEventListener("click", () => {
  applyPresetByName({
    presetName:'Default',
    presets: PRESETS,
    params,
    canvas,
    ctx,
    redraw,
  });
});

/* ===============================
   File Input
================================ */
FileInput.addEventListener("change", (e) => {
  handleFileSelect(e.target.files[0], canvas, ctx, params);
});

window.addEventListener("params:update", () => {
  gui.update(params);
  redraw(canvas, ctx, params);
});
