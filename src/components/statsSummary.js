import { AbstractComponent } from "./abstractComponent";

export class StatsSummary extends AbstractComponent {
  constructor(watched, hours, minutes, topGenre) {
    super();
    this._filmsAmount = watched;
    this._hours = hours;
    this._minutes = minutes;
    this._topGenre = topGenre;
  }

  getTemplate() {
    return `<ul class="statistic__text-list">
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">You watched</h4>
    <p class="statistic__item-text">
      ${this._filmsAmount} <span class="statistic__item-description">movies</span>
    </p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Total duration</h4>
    <p class="statistic__item-text">
      ${this._hours} <span class="statistic__item-description">h</span> ${this._minutes}
      <span class="statistic__item-description">m</span>
    </p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${this._topGenre}</p>
  </li>
</ul>;`;
  }
}
