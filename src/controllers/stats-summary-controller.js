import {
  render,
  unrender,
  getWatchedFilms,
  getHoursAndMins,
  getTopGenre
} from "../utils";
import { StatsSummary } from "../components/statsSummary";
import { POSITION } from "../consts";

export class StatsSummaryController {
  constructor(container) {
    this._container = container;
    this._statsList = new StatsSummary({});
  }

  render(films) {
    this.unrender();
    const topGenre = getTopGenre(films);
    const watchedFilms = getWatchedFilms(films);
    const [hours, minutes] = getHoursAndMins(films);

    this._statsList = new StatsSummary(watchedFilms, hours, minutes, topGenre);
    render(
      this._container.getElement(),
      this._statsList.getElement(),
      POSITION.beforeend
    );
  }

  unrender() {
    if (this._container.getElement().contains(this._statsList.getElement())) {
      unrender(this._statsList.getElement());
      this._statsList.removeElement();
    }
  }
}
