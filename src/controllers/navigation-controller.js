import Utils from "../utils.js";
import Navigation from "../components/navigation.js";
import {Position} from "../consts";

export default class NavigationController {
  constructor(container, onNavigationChange) {
    this._onNavigationChange = onNavigationChange;
    this._container = container;
    this._navigation = new Navigation(0, 0, 0);
  }
  init() {
    Utils.render(
        this._container,
        this._navigation.getElement(),
        Position.AFTERBEGIN
    );
  }
  initWithFilms(films) {
    Utils.unrender(this._navigation.getElement());
    this._navigation.removeElement();

    this._navigation = new Navigation(
        Utils.getWatched(films).length,
        Utils.getWatchlist(films).length,
        Utils.getFavorite(films).length
    );

    Utils.render(
        this._container,
        this._navigation.getElement(),
        Position.AFTERBEGIN
    );
    this._navigation.onNavigationItemClick((hash) => {
      this._navigation.makeButtonActive(hash);
      this._onNavigationChange(hash);
    });
  }
  render(films, tab) {
    this.initWithFilms(films);
    this._navigation.makeButtonActive(tab);
  }
  hide() {
    this._navigation.hide();
  }
  show() {
    this._navigation.show();
  }
}
