import Popup from "../components/popup.js";
import Utils from "../utils.js";
import {EXIT_KEY_ESC, EXIT_KEY_ESCAPE, Position, UpdateType} from "../consts";
import FilmCard from "../components/film-card.js";
import CommentsController from "../controllers/comments-controller.js";

const body = document.getElementsByTagName(`body`)[0];

export default class MovieController {
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
      Utils.unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }
  openPopup() {
    Utils.render(body, this._popup.getElement(), Position.BEFOREEND);
  }

  init() {
    Utils.render(
        this._container,
        this._filmCard.getElement(),
        Position.BEFOREEND
    );

    const disableForms = () => {
      this._comments.blockForm();
    };

    const enableForms = () => {
      this._comments.enableForm();
    };
    window.addEventListener(`offline`, disableForms);
    window.addEventListener(`online`, enableForms);

    const onEscKeyDown = (evt) => {
      if (evt.key === EXIT_KEY_ESCAPE || evt.key === EXIT_KEY_ESC) {
        this._popup.resetForm();
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
      Utils.unrender(this._popup.getElement());
    });

    this._filmCard.onWatchlistBtnClick((event) => {
      event.preventDefault();
      const updatedFilm = Utils.markWatchList(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.onHistoryBtnClick((event) => {
      event.preventDefault();
      const updatedFilm = Utils.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.onFavoriteBtnClick((event) => {
      event.preventDefault();
      const updatedFilm = Utils.markFavorite(this._film);

      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._popup.onHistoryBtnClick(() => {
      const updatedFilm = Utils.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
    });

    this._popup.onWatchlistBtnClick(() => {
      const updatedFilm = Utils.markWatchList(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.onRatingUndoClick(() => {
      const updatedFilm = Utils.markWatched(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
      this._popup.getWatchedBtnUnchecked();
    });

    this._popup.onFavoriteBtnClick(() => {
      const updatedFilm = Utils.markFavorite(this._film);
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.ratingButtonHandler((evt) => {
      this._popup.removeErrorFromButtons();
      evt.target.checked = true;

      const personalRating = evt.target.value;
      const updatedFilm = Utils.markPersonalRating(this._film, personalRating);
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
  onCommentsChange(newComments, updateType) {
    const updatedFilm = {
      ...this._film,
      comments: newComments
    };
    this._onFilmChange(updatedFilm, updateType);
  }
}
