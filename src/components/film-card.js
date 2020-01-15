import moment from "moment";

import {DEBOUNCE_TIMEOUT, DESCRIPTION_LENGTH} from "../consts";

import {AbstractComponent} from "./abstract-component";
import {countHoursAndMins} from "../utils";
import {debounce} from "lodash";
import {Movie} from "../models/films";

export class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._title = Movie.getTitle(film);
    this._rating = Movie.getRating(film);
    this._poster = Movie.getPoster(film);
    this._releaseDate = Movie.getReleaseDate(film);

    [this._hours, this._minutes] = countHoursAndMins(Movie.getRuntime(film));

    this._genres = Movie.getGenres(film);
    this._genre = this._genres[0] || ``;
    this._descriptionText = this._updateDescriptionText(
        Movie.getDescriptionText(film)
    );

    this._isWatchlist = Movie.getWatchlist(film);
    this._isWatched = Movie.getWatched(film);
    this._isFavorite = Movie.getFavorite(film);

    this._comments = Movie.getCommentsLength(film);
  }

  _updateDescriptionText(text) {
    if (text.split(``).length > DESCRIPTION_LENGTH) {
      return text.slice(0, DESCRIPTION_LENGTH) + `...`;
    }
    return text;
  }

  getTemplate() {
    return `<article class="film-card">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${moment(this._releaseDate).format(
      `YYYY`
  )}</span>
            <span class="film-card__duration">${this._hours}h
                ${this._minutes}m</span>
            <span class="film-card__genre">${this._genre}</span>
          </p>
          <img src="${this._poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${this._descriptionText}</p>
          <a class="film-card__comments">${this._comments} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._getActiveClass(
      this._isWatchlist
  )}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._getActiveClass(
      this._isWatched
  )}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._getActiveClass(
      this._isFavorite
  )}">Mark as favorite</button>
          </form>
        </article>
        `;
  }

  _getActiveClass(state) {
    return state ? `film-card__controls-item--active` : ``;
  }

  onCommentsBtnClick(callback) {
    const commentsButton = this.getElement().querySelector(
        `.film-card__comments`
    );

    commentsButton.addEventListener(`click`, callback);
  }

  onPosterClick(callback) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    poster.style.cursor = `pointer`;
    poster.addEventListener(`click`, callback);
  }
  onTitleClick(callback) {
    const title = this.getElement().querySelector(`.film-card__title`);
    title.style.cursor = `pointer`;
    title.addEventListener(`click`, callback);
  }

  onWatchlistBtnClick(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, debounce(callback, DEBOUNCE_TIMEOUT));
  }

  onFavoriteBtnClick(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, debounce(callback, DEBOUNCE_TIMEOUT));
  }

  onHistoryBtnClick(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, debounce(callback, DEBOUNCE_TIMEOUT));
  }
}
