import Utils from "../utils.js";
import Sort from "../components/sort.js";
import {Position, SortType} from "../consts";

export default class SortController {
  constructor(container, onSortChange) {
    this._sort = new Sort();
    this._onSortChange = onSortChange;
    this._container = container;
  }

  init() {
    Utils.render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    this._sort.onSortBtnClick((evt) => {
      evt.preventDefault();
      const type = evt.target.dataset.sortType;
      this._sort.makeButtonStateActive(type);
      this._onSortChange(type);
    });
  }
  hide() {
    this._sort.hide();
  }
  show() {
    this._sort.show();
  }
  handleReturningToDefault() {
    this._sort.makeButtonStateActive(SortType.DEFAULT);
  }
}
