class Slider {
  constructor({ title = "Controls", container }) {
    this.container = container;
    this.el = document.createElement("div");
    this.el.className = "glass-controller";

    if (title) {
      const titleEl = document.createElement("div");
      titleEl.className = "glass-controller__title";
      titleEl.textContent = title;
      this.el.appendChild(titleEl);
    }

    container.appendChild(this.el);
  }

  add(object, prop, { min = 0, max = 1, step = 0.01, label } = {}) {
    const control = document.createElement("div");
    control.className = "glass-control";

    const header = document.createElement("div");
    header.className = "glass-control__header";

    const name = document.createElement("span");
    name.textContent = label || prop;

    const value = document.createElement("span");
    value.textContent = object[prop];

    header.append(name, value);

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = object[prop];

    input.addEventListener("input", () => {
      object[prop] = parseFloat(input.value);
      value.textContent = input.value;
    });

    control.append(header, input);
    this.el.appendChild(control);

    return this;
  }
}


export default Slider;