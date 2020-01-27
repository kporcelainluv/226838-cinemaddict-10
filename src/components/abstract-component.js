import Utils from "../utils.js";
export default class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(
        `Can't instantiate AbstractComponent, only concrete one.`
      );
    }
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }
  removeElement() {
    this._element = null;
  }
}
