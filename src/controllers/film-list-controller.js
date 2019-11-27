import { MovieController } from "./movie-controller";
import { ShowMoreButton } from "../components/showMoreBtn";
import { render } from "../utils";
import {
  PER_PAGE,
  POSITION,
  PAGE_TYPE,
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
      if (type === PAGE_TYPE.DEFAULT) {
        return FILMS_DISPLAYED_INITIALLY;
      }
      if (type === PAGE_TYPE.SEARCH) {
        return Number.MAX_SAFE_INTEGER;
      }
      return DEFAULT_AMOUNT_DISPLAYED;
    })();

    this._onFilmUpdate = onFilmUpdate;
    this._onTogglePopup = onTogglePopup;
    this._onRenderFilmCard = onRenderFilmCard;
    this._showMoreBtn = new ShowMoreButton();
  }

  init() {
    this.render(this._films);
  }

  render(films) {
    //the problem is here

    this.unrender();

    films.slice(0, this._filmsDisplayed).forEach(film => {
      this._renderFilmCard(this._container, film);
    });

    if (
      films.length > this._filmsDisplayed &&
      this._type === PAGE_TYPE.DEFAULT
    ) {
      render(
        this._container,
        this._showMoreBtn.getElement(),
        POSITION.BEFOREEND
      );
      const callback = () => {
        console.log("callback called");

        this._filmsDisplayed += PER_PAGE;
        this.render(this._films);
        console.log({ PER_PAGE, amount: this._filmsDisplayed });
        this._showMoreBtn.removeOnShowMoreCallback(callback);
      };
      this._showMoreBtn.onClickShowMore(callback);
    }
  }

  renderDefault(films) {
    this._filmsDisplayed = FILMS_DISPLAYED_INITIALLY;
    this.render(films);
  }

  unrender() {
    this._container.innerHTML = ``;
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
}
