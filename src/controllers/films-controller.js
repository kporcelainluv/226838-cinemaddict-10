import {
  render,
  unrender,
  getMostCommentedFilms,
  getTopRatedFilms
} from "../utils";
import {DefaultFilmList} from "../components/defaultFilmList";
import {FilmsContainer} from "../components/filmContainter";
import {FilmListController} from "./film-list-controller";
import {AdditionalFilmList} from "../components/additionalFilmBlocks";
import {Loading} from "../components/loading";
import {EmptyFilms} from "../components/emptyFilms";
import {PageType, Position} from "../consts";

export class FilmsController {
  constructor({container, onFilmUpdate}) {
    this._container = container;
    this._subscriptions = [];
    this._filmsContainer = new FilmsContainer();
    this._defaultFilmList = new DefaultFilmList();
    this._emptyFilmsComponent = new EmptyFilms();

    this._topRatedList = new AdditionalFilmList(`Top Rated`);
    this._mostCommentedList = new AdditionalFilmList(`Most Commented`);
    this._loadingComponent = new Loading();

    this._onTogglePopup = this._onTogglePopup.bind(this);
    this._onRenderFilmCard = this._onRenderFilmCard.bind(this);
    this._onFilmUpdate = onFilmUpdate;
  }
  _onTogglePopup() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onRenderFilmCard(closePopup) {
    this._subscriptions.push(closePopup);
  }

  _unrender() {
    this._defaultFilmListController.unrender();
    this._ratedFilmListController.unrender();
    this._commentedFilmListController.unrender();
  }
  init() {
    render(
        this._container,
        this._filmsContainer.getElement(),
        Position.BEFOREEND
    );
    render(
        this._filmsContainer.getElement(),
        this._loadingComponent.getElement(),
        Position.AFTERBEGIN
    );
  }

  initWithFilms(films) {
    if (films.length === 0) {
      unrender(this._loadingComponent.getElement());
      this._loadingComponent.removeElement();
      render(
          this._filmsContainer.getElement(),
          this._emptyFilmsComponent.getElement(),
          `beforeend`
      );
    } else {
      unrender(this._loadingComponent.getElement());
      this._loadingComponent.removeElement();

      this._defaultFilmListController = new FilmListController({
        container: this._defaultFilmList.getElementToRenderFilmsTo(),
        films,
        onFilmUpdate: this._onFilmUpdate,
        onTogglePopup: this._onTogglePopup,
        onRenderFilmCard: this._onRenderFilmCard,
        type: PageType.DEFAULT
      });

      this._ratedFilmListController = new FilmListController({
        container: this._topRatedList.getElementToRenderFilmsTo(),
        films: getTopRatedFilms(films),
        onFilmUpdate: this._onFilmUpdate,
        onTogglePopup: this._onTogglePopup,
        onRenderFilmCard: this._onRenderFilmCard,
        type: PageType.TOP_RATED
      });

      this._commentedFilmListController = new FilmListController({
        container: this._mostCommentedList.getElementToRenderFilmsTo(),
        films: getMostCommentedFilms(films),
        onFilmUpdate: this._onFilmUpdate,
        onTogglePopup: this._onTogglePopup,
        onRenderFilmCard: this._onRenderFilmCard,
        type: PageType.MOST_COMMENTED
      });

      render(
          this._filmsContainer.getElement(),
          this._defaultFilmList.getElement(),
          Position.BEFOREEND
      );

      if (getTopRatedFilms(films).length > 0) {
        render(
            this._filmsContainer.getElement(),
            this._topRatedList.getElement(),
            Position.BEFOREEND
        );
      }
      if (getMostCommentedFilms(films).length > 0) {
        render(
            this._filmsContainer.getElement(),
            this._mostCommentedList.getElement(),
            Position.BEFOREEND
        );
      }

      this._defaultFilmListController.init();
      this._ratedFilmListController.init();
      this._commentedFilmListController.init();
    }
  }

  render(films) {
    this._unrender();
    this._defaultFilmListController.render(films);
    this._ratedFilmListController.render(getTopRatedFilms(films));
    this._commentedFilmListController.render(getMostCommentedFilms(films));
  }

  renderFilmsContainer(films) {
    this._unrender();

    this._defaultFilmListController.renderDefault(films);
    this._ratedFilmListController.render(getTopRatedFilms(films));
    this._commentedFilmListController.render(getMostCommentedFilms(films));
  }

  hide() {
    this._filmsContainer.hide();
  }
  show() {
    this._filmsContainer.show();
  }
}
