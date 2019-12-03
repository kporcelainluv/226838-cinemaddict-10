import {Popup} from "../components/popup";
import {render, unrender} from "../utils";
import {Position, UpdateType} from "../consts";
import {FilmCard} from "../components/filmCard";
import {CommentsController} from "../controllers/comments-controller";

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
    this._filmCard.addCallbackOnClickCommentsBtn(openPopup);
    this._filmCard.addCallbackOnClickPoster(openPopup);
    this._filmCard.addCallbackOnClickTitle(openPopup);
    this._popup.addCallBackOnClosingBtn(() => {
      unrender(this._popup.getElement());
    });

    this._filmCard.addCallbackOnClickWatchlistBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          watchlist: !this._film.user_details.watchlist
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.addCallbackOnClickHistoryBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          already_watched: !this._film.user_details.already_watched
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._filmCard.addCallbackOnClickFavoriteBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          favorite: !this._film.user_details.favorite
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
    });

    this._popup.addCallbackOnClickHistoryBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          already_watched: !this._film.user_details.already_watched
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
    });

    this._popup.addCallbackOnClickWatchlistBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          watchlist: !this._film.user_details.watchlist
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.addCallbackOnRatingUndo(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          already_watched: !this._film.user_details.already_watched
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;

      this._popup.toggleRatingSection();
      this._popup.getWatchedBtnUnchecked();
    });

    this._popup.addCallbackOnClickFavoriteBtn(() => {
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          favorite: !this._film.user_details.favorite
        }
      };
      this._onFilmChange(updatedFilm, {
        updateType: UpdateType.UPDATEUSERINFO
      });
      this._film = updatedFilm;
    });

    this._popup.toggleRatingButton((evt) => {
      this._popup.removeErrorFromButtons();
      evt.target.checked = true;

      const personalRating = evt.target.value;
      const updatedFilm = {
        ...this._film,
        user_details: {
          ...this._film.user_details,
          personal_rating: Number(personalRating)
        }
      };
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
