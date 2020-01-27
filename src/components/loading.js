import AbstractComponent from "./abstract-component.js";

export default class Loading extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<h1 class="loading">Loading...</h1>`;
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
}
