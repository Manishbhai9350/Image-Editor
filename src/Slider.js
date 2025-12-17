class Slider {
  constructor({ title = "Controls", container = document.body } = {}) {
    this.el = document.querySelector(".ui-controller.slider");
    this.controllers = [];

    this.toggle = document.createElement("div");
    this.toggle.className = "ui-toggle";
    this.toggle.innerHTML = `<i class="ri-arrow-up-s-line"></i>`;

    if (title) {
      this.titleEl = document.createElement("div");
      this.titleEl.className = "ui-controller__title";
      this.titleEl.textContent = title;
      this.el.appendChild(this.titleEl);
    }

    this.content = document.createElement("div");
    this.content.className = "ui-controller__content";

    this.el.append(this.toggle, this.content);
    container.appendChild(this.el);

    this.toggle.addEventListener("click", () => {
      this.el.classList.toggle("collapsed");
    });
  }

  add(object, prop, { step = 1, label: paramLabel } = {}) {
    const config = object[prop];
    const min = config.min ?? 0;
    const max = config.max ?? 1;
    const label = config.label ?? paramLabel ?? prop;
    const range = max - min;

    const control = document.createElement("div");
    control.className = "ui-control";

    const header = document.createElement("div");
    header.className = "ui-control__header";

    const name = document.createElement("span");
    name.textContent = label;

    const valueEl = document.createElement("span");

    header.append(name, valueEl);

    const slider = document.createElement("div");
    slider.className = "ui-slider";

    const fill = document.createElement("div");
    fill.className = "ui-slider__fill";

    const thumb = document.createElement("div");
    thumb.className = "ui-slider__thumb";

    slider.append(fill, thumb);

    const updateUI = (value) => {
      const percent = (value - min) / range;
      fill.style.width = `${percent * 100}%`;
      thumb.style.left = `${percent * 100}%`;
      valueEl.textContent = Math.round(value);
    };

    this.controllers.push({
      prop,
      update: () => updateUI(object[prop].value)
    });

    const setFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.min(1, Math.max(0, percent));

      let value = min + percent * range;
      value = Math.round(value / step) * step;
      value = Math.min(max, Math.max(min, value));

      config.value = value;
      updateUI(value);
      this.onUpdate();
    };

    slider.addEventListener("mousedown", (e) => {
      setFromClientX(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopMouse);
    });

    const onMouseMove = (e) => setFromClientX(e.clientX);
    const stopMouse = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopMouse);
    };

    updateUI(config.value);

    control.append(header, slider);
    this.content.appendChild(control);
    return this;
  }

  update(params) {
    this.controllers.forEach(c => {
      if (params[c.prop]) c.update();
    });
  }

  onUpdate(fn) {
  }
}

export default Slider;
