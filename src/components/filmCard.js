import moment from "moment";
import { DESCRIPTION_LENGTH } from "../consts";

import { AbstractComponent } from "./abstractComponent";
import { countHoursAndMins } from "../utils";

export class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._title = film.film_info.title;
    this._rating = film.film_info.total_rating;
    this._poster = film.film_info.poster;
    this._releaseDate = film.film_info.release.date;

    [this._hours, this._minutes] = countHoursAndMins(film.film_info.runtime);

    this._genres = film.film_info.genre;
    this._genre = this._genres[0] || ``;
    this._descriptionText = this._updateDescriptionText(
      film.film_info.description
    );

    this._isWatchlist = film.user_details.watchlist;
    this._isWatched = film.user_details.already_watched;
    this._isFavorite = film.user_details.favorite;

    this._comments = film.comments.length;
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

  addCallbackOnClickCommentsBtn(callback) {
    const commentsButton = this.getElement().querySelector(
      `.film-card__comments`
    );

    commentsButton.addEventListener(`click`, callback);
  }

  addCallbackOnClickPoster(callback) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    poster.style.cursor = `pointer`;
    poster.addEventListener(`click`, callback);
  }
  addCallbackOnClickTitle(callback) {
    const title = this.getElement().querySelector(`.film-card__title`);
    title.style.cursor = `pointer`;
    title.addEventListener(`click`, callback);
  }

  addCallbackOnClickWatchlistBtn(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, evt => {
        evt.preventDefault();
        callback(evt);
      });
  }

  addCallbackOnClickFavoriteBtn(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, evt => {
        evt.preventDefault();
        callback(evt);
      });
  }

  addCallbackOnClickHistoryBtn(callback) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, evt => {
        evt.preventDefault();
        callback(evt);
      });
  }
}
