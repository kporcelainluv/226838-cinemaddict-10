import {render, unrender} from "../utils";
import {FilmListController} from "./film-list-controller";
import {SearchResultHeading} from "../components/search-result-heading";
import {EmptySearch} from "../components/empty-search";
import {SearchResultContainer} from "../components/search-result-container";
import {Position, PageType} from "../consts";

export class SearchResultController {
  constructor({container, onFilmUpdate}) {
    this._container = container;
    this._subscriptions = [];

    this._searchResultContainer = new SearchResultContainer();
    this._searchResultHeading = new SearchResultHeading(0);
    this._emptySearch = new EmptySearch();

    this._onFilmUpdate = onFilmUpdate;
    this._onTogglePopup = this._onTogglePopup.bind(this);
    this._onRenderFilmCard = this._onRenderFilmCard.bind(this);

    this._filmListController = undefined;
  }
  _onTogglePopup() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onRenderFilmCard(closePopup) {
    this._subscriptions.push(closePopup);
  }
  init(films) {
    render(
        this._container,
        this._searchResultContainer.getElement(),
        Position.BEFOREEND
    );
    this._filmListController = new FilmListController({
      container: this._searchResultContainer.getElement(),
      films,
      onFilmUpdate: this._onFilmUpdate,
      onTogglePopup: this._onTogglePopup,
      onRenderFilmCard: this._onRenderFilmCard,
      type: PageType.SEARCH
    });
  }

  render(films) {
    this.unrender();

    if (films.length > 0) {
      this._searchResultHeading = new SearchResultHeading(films.length);
      render(
          this._searchResultContainer.getElement(),
          this._searchResultHeading.getElement(),
          Position.AFTERBEGIN
      );
      this._filmListController.render(films);
    } else {
      render(
          this._searchResultContainer.getElement(),
          this._emptySearch.getElement(),
          Position.AFTERBEGIN
      );
    }
  }

  unrender() {
    unrender(this._searchResultHeading.getElement());
    unrender(this._emptySearch.getElement());
    this._filmListController.unrender();
  }
}
