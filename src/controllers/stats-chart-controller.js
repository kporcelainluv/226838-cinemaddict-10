import StatsChart from "../components/statistics-chart.js";
import Utils from "../utils.js";
import {Position} from "../consts";

export default class StatsChartController {
  constructor(container) {
    this._container = container;
    this._chart = new StatsChart();
  }

  render(films) {
    this.unrender();
    this._chart = new StatsChart();
    this._chart.createChart(Utils.getGenresByKeysVals(films));
    Utils.render(
        this._container.getElement(),
        this._chart.getElement(),
        Position.BEFOREEND
    );
  }
  unrender() {
    Utils.unrender(this._chart.getElement());
    this._chart.removeElement();
  }
}
