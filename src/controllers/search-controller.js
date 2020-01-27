import Search from "../components/search.js";
import Utils from "../utils.js";
import {Position} from "../consts";

export default class SearchController {
  constructor(container, onSearchChange) {
    this._search = new Search();
    this._onSearchChange = onSearchChange;
    this._container = container;
  }

  init() {
    Utils.render(
        this._container,
        this._search.getElement(),
        Position.BEFOREEND
    );

    this._search.inputChangeHandler((evt) => {
      this._onSearchChange(evt.target.value);
    });

    this._search.onClearButtonClick(() => {
      this._onSearchChange(``);
    });
  }
}
