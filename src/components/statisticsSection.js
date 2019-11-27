import { AbstractComponent } from "./abstractComponent";

export class StatisticsSection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="statistic"></section>`;
  }
}

