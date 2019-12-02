import {
  render,
  unrender,
  getWatched,
  getWatchlist,
  getFavorite
} from "../utils";
import { Navigation } from "../components/navigation";
import { Position } from "../consts";

export class NavigationController {
  constructor(container, onNavigationChange) {
    this._onNavigationChange = onNavigationChange;
    this._container = container;
    this._navigation = new Navigation(0, 0, 0);
  }
  init() {
    render(this._container, this._navigation.getElement(), Position.AFTERBEGIN);
  }
  initWithFilms(films) {
    unrender(this._navigation.getElement());
    this._navigation.removeElement();

    this._navigation = new Navigation(
      getWatched(films).length,
      getWatchlist(films).length,
      getFavorite(films).length
    );

    render(this._container, this._navigation.getElement(), Position.AFTERBEGIN);
    this._navigation.addCallbackOnNavigationItem(hash => {
      this._navigation.makeButtonActive(hash);
      this._onNavigationChange(hash);
    });
  }
  render(films, tab) {
    unrender(this._navigation.getElement());
    this._navigation.removeElement();

    this._navigation = new Navigation(
      getWatched(films).length,
      getWatchlist(films).length,
      getFavorite(films).length
    );
    this.init();
    this._navigation.makeButtonActive(tab);
  }
  hide() {
    this._navigation.hide();
  }
  show() {
    this._navigation.show();
  }
}
