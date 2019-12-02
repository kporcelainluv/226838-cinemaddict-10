import { Search } from "../components/search";
import { render } from "../utils";
import { Position } from "../consts";

export class SearchController {
  constructor(container, onSearchChange) {
    this._search = new Search();
    this._onSearchChange = onSearchChange;
    this._container = container;
  }

  init() {
    render(this._container, this._search.getElement(), Position.BEFOREEND);

    this._search.addCallbackOnInputChange(evt => {
      this._onSearchChange(evt.target.value);
    });

    this._search.addCallBackOnClearButton(() => {
      this._onSearchChange(``);
    });
  }
}
