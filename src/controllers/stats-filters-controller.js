import { StatsFilters } from "../components/statsFilters";
import { render, unrender } from "../utils";
import { Position } from "../consts";

export class StatsFiltersController {
  constructor(container, onTabChange) {
    this._container = container;
    this._statsFilters = new StatsFilters();
    this.onTabChange = onTabChange;
  }

  getActiveTab() {
    this._statsFilters.onAddListenersOnFilters(evt => {
      this.onTabChange(evt.target.value);
    });
  }

  render() {
    render(
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
      unrender(this._statsFilters.getElement());
      this._statsFilters.removeElement();
    }
  }
}
