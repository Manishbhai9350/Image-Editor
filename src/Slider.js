class Slider {
  constructor({ title = "Controls", container = document.body } = {}) {
    this.el = document.createElement("div");
    this.el.className = "ui-controller";

    /* Toggle ( > ) */
    this.toggle = document.createElement("div");
    this.toggle.className = "ui-toggle";
    this.toggle.innerHTML = `<i class="ri-arrow-up-s-line"></i>`;

    /* Title */
    if (title) {
      this.titleEl = document.createElement("div");
      this.titleEl.className = "ui-controller__title";
      this.titleEl.textContent = title;
      this.el.appendChild(this.titleEl);
    }

    /* Content wrapper */
    this.content = document.createElement("div");
    this.content.className = "ui-controller__content";

    this.el.append(this.toggle, this.content);
    container.appendChild(this.el);

    /* Toggle behavior */
    this.toggle.addEventListener("click", () => {
      this.el.classList.toggle("collapsed");
    });
  }

  add(object, prop, { min = 0, max = 1, step = 0.01, label } = {}) {
    const control = document.createElement("div");
    control.className = "ui-control";

    /* Header */
    const header = document.createElement("div");
    header.className = "ui-control__header";

    const name = document.createElement("span");
    name.textContent = label || prop;

    const valueEl = document.createElement("span");

    header.append(name, valueEl);

    /* Slider */
    const slider = document.createElement("div");
    slider.className = "ui-slider";

    const fill = document.createElement("div");
    fill.className = "ui-slider__fill";

    const thumb = document.createElement("div");
    thumb.className = "ui-slider__thumb";

    slider.append(fill, thumb);

    const range = max - min;
    const precision =
      step < 1 ? (String(step).split(".")[1] || "").length : 0;

    const updateUI = (value) => {
      const percent = (value - min) / range;
      fill.style.width = `${percent * 100}%`;
      thumb.style.left = `${percent * 100}%`;
      valueEl.textContent = value.toFixed(precision);
    };

    const setFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.min(1, Math.max(0, percent));

      let raw = min + percent * range;
      let stepped = Math.round(raw / step) * step;
      stepped = Math.min(max, Math.max(min, stepped));

      object[prop] = stepped;
      updateUI(stepped);
    };

    /* Mouse */
    const onMouseMove = (e) => setFromClientX(e.clientX);
    const stopMouse = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopMouse);
    };

    slider.addEventListener("mousedown", (e) => {
      setFromClientX(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopMouse);
    });

    /* Touch */
    const onTouchMove = (e) =>
      setFromClientX(e.touches[0].clientX);
    const stopTouch = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopTouch);
    };

    slider.addEventListener("touchstart", (e) => {
      setFromClientX(e.touches[0].clientX);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", stopTouch);
    });

    updateUI(object[prop]);

    control.append(header, slider);
    this.content.appendChild(control);

    return this;
  }
}


export default Slider;
