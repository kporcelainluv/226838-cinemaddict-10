import {StatsRank} from "../components/statistics-rank";
import {render, unrender, getWatchedFilms} from "../utils";
import {getStatsRank} from "../utils";
import {Position} from "../consts";

export class UserRankController {
  constructor(container) {
    this._container = container;
    this._statsRank = new StatsRank(null);
  }

  render(films) {
    const watched = getWatchedFilms(films);
    this.unrender();

    this._statsRank = new StatsRank(getStatsRank(watched));
    render(
        this._container.getElement(),
        this._statsRank.getElement(),
        Position.AFTERBEGIN
    );
  }
  unrender() {
    if (this._container.getElement().contains(this._statsRank.getElement())) {
      unrender(this._statsRank.getElement());
      this._statsRank.removeElement();
    }
  }
}
