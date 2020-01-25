import {AbstractComponent} from "./abstract-component";
import {countHoursAndMins} from "../utils";
import moment from "moment";
import {RATING_LENGTH, TIMEOUT, DEBOUNCE_TIMEOUT} from "../consts";
import {debounce} from "lodash";

export class Popup extends AbstractComponent {
  constructor(film) {
    super();
    this._title = film.title;
    this._alternativeTitle = film.originalTitle;
    this._rating = film.rating;
    this._poster = film.poster;
    this._ageRating = film.ageRate;

    this._director = film.director;
    this._writers = film.writers;
    this._actors = film.actors;
    this._releaseDate = film.date;
    this._releaseCountry = film.country;
    [this._hours, this._minutes] = countHoursAndMins(film.runtime);
    this._genre = this._createGenresString(film.genres);
    this._descriptionText = film.description;
    this._personalRating = film.personalRating;
    this._isWatchlist = film.isWatchlist;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;
  }

  _createGenresString(genres) {
    if (genres.length === 0) {
      return ``;
    }
    if (genres.length === 1) {
      return genres;
    }
    return genres.reduce((newGenresList, element, index, genresList) => {
      if (index === genresList.length - 1) {
        return newGenresList + element;
      }
      return newGenresList + element + `, `;
    }, ``);
  }
  _getGenresTag(genres) {
    if (genres.length === 0) {
      return ``;
    } else if (genres.length === 1) {
      return `Genre`;
    }
    return `Genres`;
  }
  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="">

            <p class="film-details__age">${this._ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${
  this._alternativeTitle
}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers}</tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors}</tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(
      this._releaseDate
  ).format(`DD MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._hours}h
                ${this._minutes}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${this._getGenresTag(
      this._genre
  )}</td>
                <td class="film-details__cell">${
  this._genre.length === 0 ? `` : this._genre
}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${this._descriptionText}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${
  this._isWatchlist ? `checked` : ``
}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${
  this._isWatched ? `checked` : ``
}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${
  this._isFavorite ? `checked` : ``
}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      <div class="form-details__middle-container ${
  this._isWatched ? `` : `visually-hidden`
}">

      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${
  this._poster
}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>
            <div class="film-details__user-rating-score">
      ${new Array(RATING_LENGTH)
        .fill(0)
        .map((_, id) => {
          const v = id + 1;
          return `
                <input type="radio" name="score"
                  class="film-details__user-rating-input visually-hidden"
                  ${v === this._personalRating ? `checked` : ``}
                  value="${v}"
                  id="rating-${v}"
    >
    <label class="film-details__user-rating-label" for="rating-${v}">${v}</label>
    `;
        })
        .join(` `)}</div>
          </section>
        </div>
        </section>
      </div>
        <div class="form-details__bottom-container">

    </div>
    </form>
  </section>`;
  }
  getFormElement() {
    return this.getElement().querySelector(`.film-details__inner`);
  }
  getCommentsContainer() {
    return this.getElement().querySelector(`.form-details__bottom-container`);
  }
  getWatchedBtnUnchecked() {
    this.getElement().querySelectorAll(
        `.film-details__control-input`
    )[1].checked = false;
  }

  toggleRatingSection() {
    this.getElement()
      .querySelector(`.form-details__middle-container`)
      .classList.toggle(`visually-hidden`);
  }

  shakePopup() {
    const form = this.getFormElement();
    form.style.animation = `shake 0.6s`;
    setTimeout(() => {
      form.style.animation = ``;
    }, TIMEOUT);
  }
  addRedBackgroundToButton(elm) {
    const allLabels = this.getElement().querySelectorAll(
        `.film-details__user-rating-label`
    );
    Array.from(allLabels).forEach((label) => {
      if (label.htmlFor === `rating-${elm.value}`) {
        label.classList.add(`film-details__user-rating-label--error`);
      }
    });
  }
  removeErrorFromButtons() {
    Array.from(
        this.getElement().querySelectorAll(`.film-details__user-rating-label`)
    ).forEach((elm) => {
      if (elm.classList.contains(`film-details__user-rating-label--error`)) {
        elm.classList.toggle(`film-details__user-rating-label--error`);
      }
    });
  }
  resetForm() {
    this.getElement()
      .querySelector(`.film-details__inner`)
      .reset();
  }

  onClosingBtnClick(callback) {
    const closingButton = this.getElement().querySelector(
        `.film-details__close-btn`
    );
    closingButton.addEventListener(`click`, callback);
  }
  onWatchlistBtnClick(callback) {
    const debouncedCallback = debounce(callback, DEBOUNCE_TIMEOUT);
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, (e) => {
        debouncedCallback(e);
      });
  }

  onFavoriteBtnClick(callback) {
    const debouncedCallback = debounce(callback, DEBOUNCE_TIMEOUT);
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, (e) => {
        debouncedCallback(e);
      });
  }

  onHistoryBtnClick(callback) {
    const debouncedCallback = debounce(callback, DEBOUNCE_TIMEOUT);
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, (e) => {
        debouncedCallback(e);
      });
  }
  onRatingUndoClick(callback) {
    this.getElement()
      .querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, callback);
  }
  ratingButtonHandler(callback) {
    this.getElement()
      .querySelectorAll(`.film-details__user-rating-input`)
      .forEach((elm) => elm.addEventListener(`keydown`, callback));
  }
}
