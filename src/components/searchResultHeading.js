import { AbstractComponent } from "./abstractComponent";

export class SearchResultHeading extends AbstractComponent {
  constructor(amount) {
    super();
    this._filmsAmount = amount;
  }
  getTemplate() {
    return `<div class="result">
    <p class="result__text">Result <span class="result__count">${this._filmsAmount}</span></p>
  </div>`;
  }
}
