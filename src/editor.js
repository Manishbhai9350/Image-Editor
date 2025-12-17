let image = null;
let drawState = null;

/* ===============================
   Handle File Selection
================================ */
export function handleFileSelect(file, canvas, ctx, params) {
  if (!file) return;

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

  console.log(cw,ch)

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
