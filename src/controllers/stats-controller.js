import StatisticsSection from "../components/statistics-section.js";
import UserRankController from "./user-rank-controller.js";
import StatsFiltersController from "./stats-filters-controller.js";
import StatsSummaryController from "./stats-summary-controller.js";
import StatsChartController from "./stats-chart-controller.js";
import Utils from "../utils.js";
import { Position, StatsFilterType } from "../consts";

export default class StatsController {
  constructor(container, films) {
    this._container = container;
    this._films = films;

    this._statsSection = new StatisticsSection();
    this._rankController = new UserRankController(this._statsSection);

    this._filters = new StatsFiltersController(
      this._statsSection,
      this.onTabChange.bind(this)
    );

    this._statsSummary = new StatsSummaryController(this._statsSection);
    this._chart = new StatsChartController(this._statsSection);
  }

  init(films) {
    this._films = films;
    Utils.render(
      this._container,
      this._statsSection.getElement(),
      Position.BEFOREEND
    );
  }

  onTabChange(activeTab) {
    const filteredFilms = Utils.getFilmsByFilter(this._films, activeTab);
    this._statsSummary.render(filteredFilms);
    this._chart.render(filteredFilms);
    this._rankController.render(filteredFilms);
  }

  render(films) {
    this.unrender();
    this._films = films;
    this._filters.render();
    this._statsSummary.render(films);
    this._chart.render(films);
    this._rankController.render(films);
    this.onTabChange(StatsFilterType.ALL);
  }
  unrender() {
    this._rankController.unrender();
    this._filters.unrender();
    this._statsSummary.unrender();
    this._chart.unrender();
  }
  hide() {
    this._statsSection.hide();
  }
  show() {
    this._statsSection.show();
  }
}
