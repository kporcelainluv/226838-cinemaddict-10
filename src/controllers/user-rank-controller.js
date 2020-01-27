import StatsRank from "../components/statistics-rank.js";
import Utils from "../utils.js";
import {Position} from "../consts";

export default class UserRankController {
  constructor(container) {
    this._container = container;
    this._statsRank = new StatsRank(null);
  }

  render(films) {
    const watched = Utils.getWatchedFilms(films);
    this.unrender();

    this._statsRank = new StatsRank(Utils.getStatsRank(watched));
    Utils.render(
        this._container.getElement(),
        this._statsRank.getElement(),
        Position.AFTERBEGIN
    );
  }
  unrender() {
    if (this._container.getElement().contains(this._statsRank.getElement())) {
      Utils.unrender(this._statsRank.getElement());
      this._statsRank.removeElement();
    }
  }
}
