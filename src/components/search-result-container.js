import AbstractComponent from "./abstract-component.js";
export default class SearchResultContainer extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<section class="films"></section>`;
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
}
