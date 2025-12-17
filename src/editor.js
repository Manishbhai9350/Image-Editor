let image = null;
let File = null;
let drawState = null;

export const PRESETS = {
  Default: {
    brightness: 100,
    contrast: 50,
    saturation: 50,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100,
  },
  Normal: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100,
  },

  Warm: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotation: 8,
    blur: 0,
    grayscale: 0,
    sepia: 12,
    invert: 0,
    opacity: 100,
  },

  Cool: {
    brightness: 95,
    contrast: 100,
    saturation: 100,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100,
  },

  Vintage: {
    brightness: 100,
    contrast: 90,
    saturation: 80,
    hueRotation: 0,
    blur: 0,
    grayscale: 10,
    sepia: 35,
    invert: 0,
    opacity: 100,
  },

  BnW: {
    brightness: 90,
    contrast: 100,
    saturation: 0,
    hueRotation: 0,
    blur: 0,
    grayscale: 100,
    sepia: 0,
    invert: 0,
    opacity: 100,
  },
};

/* ===============================
   Handle File Downloads
================================ */

export function downloadCanvas(canvas) {
  if (!canvas || !File) return;

  const splitted = File?.name?.split(".");

  if (!splitted) return;
  const name = splitted.splice(0, splitted.length - 1).join("") + "(1)";

  const link = document.createElement("a");
  link.download = name;
  link.href = canvas.toDataURL("image/png");

  link.click();
}

/* ===============================
   Handle File Selection
================================ */
export function handleFileSelect(file, canvas, ctx, params) {
  if (!file) return;

  File = file;

  const img = new Image();
  img.onload = () => {
    image = img;
    fitImageToCanvas(img, canvas, ctx, params);
  };

  img.src = URL.createObjectURL(file);
}

/* ===============================
   Fit Image (largest side logic)
================================ */
function fitImageToCanvas(img, canvas, ctx, params) {
  calculateDrawState(canvas);
  redraw(canvas, ctx, params);
}

/* ===============================
   Apply Filters
================================ */
export function ApplyFilter(ctx, params) {
  if (!image || !drawState) return;

  const {
    brightness,
    contrast,
    saturation,
    hueRotation,
    blur,
    grayscale,
    sepia,
    invert,
    opacity,
  } = params;

  ctx.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturation.value}%)
    hue-rotate(${hueRotation.value}deg)
    blur(${blur.value}px)
    grayscale(${grayscale.value}%)
    sepia(${sepia.value}%)
    invert(${invert.value}%)
    opacity(${opacity.value}%)
  `;
}

/* ===============================
   Redraw Canvas
================================ */
export function redraw(canvas, ctx, params) {
  if (!image || !drawState) return;

  const { drawWidth, drawHeight } = drawState;

  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ApplyFilter(ctx, params);

  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  ctx.filter = "none";
}

export function calculateDrawState(canvas) {
  if (!image) return null;

  const cw = canvas.width;
  const ch = canvas.height;

  const imgRatio = image.width / image.height;
  const canvasRatio = cw / ch;

  let drawWidth, drawHeight;

  // Fit by biggest side
  if (imgRatio > canvasRatio) {
    drawWidth = cw;
    drawHeight = cw / imgRatio;
  } else {
    drawHeight = ch;
    drawWidth = ch * imgRatio;
  }

  drawState = {
    drawWidth,
    drawHeight,
  };
}

export function notifyParamsUpdated() {
  window.dispatchEvent(new CustomEvent("params:update"));
}

export function applyPresetByName({
  presetName,
  presets,
  params,
  canvas,
  ctx,
  redraw,
}) {
  const preset = presets[presetName];
  if (!preset) return;

  document.querySelectorAll(".preset-btn").forEach((b) => {
    const preset = b.getAttribute("preset");
    if (preset == presetName) {
      b.classList.add("selected");
    } else {
      b.classList.remove("selected");
    }
  });

  for (const key in preset) {
    if (params[key]) {
      params[key].value = preset[key];
    }
  }

  notifyParamsUpdated();
  redraw(canvas, ctx, params);
}

export function renderPresetButtons({ presets, params, canvas, ctx, redraw }) {
  const container = document.querySelector(
    ".ui-controller.presets .ui-controller__content"
  );

  if (!container) return;

  container.innerHTML = "";

  for (const presetName in presets) {
    const btn = document.createElement("button");
    btn.setAttribute("preset", presetName);
    btn.className = "preset editor-btn preset-btn";
    btn.textContent = presetName;

    btn.addEventListener("click", () => {
      applyPresetByName({
        presetName,
        presets,
        params,
        canvas,
        ctx,
        redraw,
      });
    });

    container.appendChild(btn);
  }
}
