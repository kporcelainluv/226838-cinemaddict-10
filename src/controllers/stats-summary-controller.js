import Utils from "../utils.js";
import StatsSummary from "../components/statistics-summary.js";
import { Position } from "../consts";

export default class StatsSummaryController {
  constructor(container) {
    this._container = container;
    this._statsList = new StatsSummary({});
  }

  render(films) {
    this.unrender();
    const topGenre = Utils.getTopGenre(films);
    const watchedFilms = Utils.getWatchedFilms(films);
    const [hours, minutes] = Utils.getHoursAndMins(films);
    this._statsList = new StatsSummary(watchedFilms, hours, minutes, topGenre);
    Utils.render(
      this._container.getElement(),
      this._statsList.getElement(),
      Position.BEFOREEND
    );
  }

  unrender() {
    if (this._container.getElement().contains(this._statsList.getElement())) {
      Utils.unrender(this._statsList.getElement());
      this._statsList.removeElement();
    }
  }
}
