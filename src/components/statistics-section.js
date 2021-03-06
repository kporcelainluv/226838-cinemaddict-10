import AbstractComponent from "./abstract-component.js";

export default class StatisticsSection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="statistic"></section>`;
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
}
