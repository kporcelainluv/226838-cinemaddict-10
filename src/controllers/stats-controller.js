import {StatisticsSection} from "../components/statisticsSection";
import {UserRankController} from "./user-rank-controller";
import {StatsFiltersController} from "./stats-filters-controller";
import {StatsSummaryController} from "./stats-summary-controller";
import {StatsChartController} from "./stats-chart-controller";

import {render, getFilmsByFilter} from "../utils";
import {Position, StatsFilterType} from "../consts";

export class StatsController {
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
    render(
        this._container,
        this._statsSection.getElement(),
        Position.BEFOREEND
    );
  }

  onTabChange(activeTab) {
    const filteredFilms = getFilmsByFilter(this._films, activeTab);
    this._statsSummary.render(filteredFilms);
    this._chart.render(filteredFilms);
    this._rankController.render(filteredFilms);
  }

  render() {
    this._filters.render();
    this.onTabChange(StatsFilterType.ALL);
  }
  unrender() {
    this._rankController.unrender();
    this._filters.unrender();
    this._statsSummary.unrender();
    this._chart.unrender();
  }
}
