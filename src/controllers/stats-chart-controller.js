import { StatsChart } from "../components/statsChart";
import { render, unrender, getGenresByKeysVals } from "../utils";
import { Position } from "../consts";

export class StatsChartController {
  constructor(container) {
    this._container = container;
    this._chart = new StatsChart();
  }

  render(films) {
    this.unrender();
    this._chart = new StatsChart();
    this._chart.createChart(getGenresByKeysVals(films));
    render(
      this._container.getElement(),
      this._chart.getElement(),
      Position.BEFOREEND
    );
  }
  unrender() {
    unrender(this._chart.getElement());
    this._chart.removeElement();
  }
}
