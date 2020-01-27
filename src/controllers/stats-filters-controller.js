import StatsFilters from "../components/statistic-filters.js";
import Utils from "../utils.js";
import { Position } from "../consts";

export default class StatsFiltersController {
  constructor(container, onTabChange) {
    this._container = container;
    this._statsFilters = new StatsFilters();
    this.onTabChange = onTabChange;
  }

  getActiveTab() {
    this._statsFilters.onFiltersClick(evt => {
      this.onTabChange(evt.target.value);
    });
  }

  render() {
    Utils.render(
      this._container.getElement(),
      this._statsFilters.getElement(),
      Position.BEFOREEND
    );
    this.getActiveTab();
  }

  unrender() {
    if (
      this._container.getElement().contains(this._statsFilters.getElement())
    ) {
      Utils.unrender(this._statsFilters.getElement());
      this._statsFilters.removeElement();
    }
  }
}
