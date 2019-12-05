import {MovieController} from "./movie-controller";
import {ShowMoreButton} from "../components/showMoreBtn";
import {render} from "../utils";
import {
  PER_PAGE,
  Position,
  PageType,
  FILMS_DISPLAYED_INITIALLY,
  DEFAULT_AMOUNT_DISPLAYED
} from "../consts";

export class FilmListController {
  constructor({
    container,
    films,
    onFilmUpdate,
    onTogglePopup,
    onRenderFilmCard,
    type
  }) {
    this._container = container;

    this._films = films;
    this._type = type;
    this._filmsDisplayed = (() => {
      if (type === PageType.DEFAULT) {
        return FILMS_DISPLAYED_INITIALLY;
      }
      if (type === PageType.SEARCH) {
        return Number.MAX_SAFE_INTEGER;
      }
      return DEFAULT_AMOUNT_DISPLAYED;
    })();

    this._onFilmUpdate = onFilmUpdate;
    this._onTogglePopup = onTogglePopup;
    this._onRenderFilmCard = onRenderFilmCard;
    this._showMoreBtn = new ShowMoreButton();
  }
  _renderFilmCard(container, film) {
    const movieController = new MovieController(
        container,
        film,
        this._onFilmUpdate,
        this._onTogglePopup
    );

    movieController.init();
    this._onRenderFilmCard(movieController.closePopup.bind(movieController));
  }
  init() {
    this.render(this._films);
  }
  render(films) {
    if (films.length > 0) {
      films.slice(0, this._filmsDisplayed || 0).forEach((film) => {
        this._renderFilmCard(this._container, film);
      });

      if (
        films.length > this._filmsDisplayed &&
        this._type === PageType.DEFAULT
      ) {
        render(
            this._container,
            this._showMoreBtn.getElement(),
            Position.BEFOREEND
        );
        const callback = () => {
          this.unrender();
          this._filmsDisplayed += PER_PAGE;
          this._showMoreBtn.removeShowMoreCallback(callback);
          this.render(films);
        };
        this._showMoreBtn.onShowMoreClick(callback);
      }
    }
  }

  renderDefault(films) {
    this._filmsDisplayed = FILMS_DISPLAYED_INITIALLY;
    this.render(films);
  }

  unrender() {
    this._container.innerHTML = ``;
  }
}
