import {Popup} from "../components/popup";
import {render, unrender} from "../utils";
import {Position, UpdateType} from "../consts";
import {FilmCard} from "../components/filmCard";
import {CommentsController} from "../controllers/comments-controller";
import {Movie} from "../models/films";

const body = document.getElementsByTagName(`body`)[0];

export class MovieController {
  constructor(container, film, onFilmChange, onTogglePopup) {
    this._film = film;
    this._container = container;

    this._onFilmChange = onFilmChange;
    this._onTogglePopup = onTogglePopup;

    this.closePopup = this.closePopup.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.onCommentsChange = this.onCommentsChange.bind(this);

    this._filmCard = new FilmCard(this._film);
    this._popup = new Popup(this._film);
    this._comments = new CommentsController(
        this._popup,
        this._film.comments,
        this.onCommentsChange
    );
  }

  closePopup() {
    if (body.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }

  onCommentsChange(newComments, updateType) {
    const updatedFilm = {
      ...this._film,
      comments: newComments
    };
    this._onFilmChange(updatedFilm, updateType);
  }

  openPopup() {
    render(body, this._popup.getElement(), Position.BEFOREEND);
  }

  init() {
    render(this._container, this._filmCard.getElement(), Position.BEFOREEND);

    const disableForms = () => {
      this._popup.disableForm();
      this._comments.blockForm();
    };

    const enableForms = () => {
      this._popup.enableForm();
      this._comments.enableForm();
    };
    window.addEventListener(`offline`, disableForms);
    window.addEventListener(`online`, enableForms);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this.closePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const openPopup = () => {
      if (!navigator.onLine) {
        disableForms();
      }
      this._onTogglePopup();
      this.openPopup();
      this._comments.init();
      document.addEventListener(`keydown`, onEscKeyDown);
    };
    this._filmCard.onCommentsBtnClick(openPopup);
    this._filmCard.onPosterClick(openPopup);
    this._filmCard.onTitleClick(openPopup);
    this._popup.onClosingBtnClick(() => {
      unrender(this._popup.getElement());
    });

    this._filmCard.onWatchlistBtnClick(() => {
      const updatedFilm = Movie.markWatchList(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.onHistoryBtnClick(() => {
      const updatedFilm = Movie.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.onFavoriteBtnClick(() => {
      const updatedFilm = Movie.markFavorite(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._popup.onHistoryBtnClick(() => {
      const updatedFilm = Movie.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
    });

    this._popup.onWatchlistBtnClick(() => {
      const updatedFilm = Movie.markWatchList(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.onRatingUndoClick(() => {
      const updatedFilm = Movie.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
      this._popup.getWatchedBtnUnchecked();
    });

    this._popup.onFavoriteBtnClick(() => {
      const updatedFilm = Movie.getFavorite(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.ratingButtonHandler((evt) => {
      this._popup.removeErrorFromButtons();
      evt.target.checked = true;

      const personalRating = evt.target.value;
      const updatedFilm = Movie.markPersonalRating(this._film, personalRating);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO,
        onSuccess: () => {
          this._popup.enableForm();
        },
        onError: () => {
          this._popup.shakePopup();
          this._popup.enableForm();
          this._popup.addRedBackgroundToButton(evt.target);
        }
      });
      this._film = updatedFilm;
    });
  }
}
