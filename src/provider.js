import { ModelMovie } from "./models/model-movie";
import { ModelComment } from "./models/model-comments";

const objectToArray = object => {
  return Object.keys(object).map(id => object[id]);
};

export const Provider = class {
  constructor({ api, store }) {
    this._api = api;
    this._store = store;
  }

  updateFilm({ film }) {
    // TODO: Refactor
    if (this._isOnline()) {
      return this._api.updateFilm({ film: film.toRAW() }).then(updatedFilm => {
        this._store.updateAllFilms({
          key: updatedFilm.id,
          item: ModelMovie.parseMovie(updatedFilm)
        });
        return ModelMovie.parseMovie(updatedFilm);
      });
    } else {
      // or regular film here?
      this._store.updateAllFilms({
        key: film.id,
        item: ModelMovie.parseMovie(film)
      });
      return Promise.resolve(ModelMovie.parseMovie(film));
    }
  }

  createComment({ film, comment }) {
    if (this._isOnline()) {
      return this._api
        .createComment({ film, comment: comment.toRAW() })
        .then(updatedComments => {
          this._store.addComments({
            key: film.id,
            item: ModelComment.parseComments(updatedComments)
          });
          return ModelComment.parseComments(updatedComments);
        });
    } else {
      // comment.id = this._generateId();
      comment.id = "647837";
      const newComments = {
        ...film,
        comments: {
          ...film.comments,
          comment
        }
      };
      this._store.addComments({
        key: film.id,
        item: ModelComment.parseComments(newComments)
      });
      return Promise.resolve(ModelComment.parseComment(newComments));
    }
  }

  deleteComment({ comment }) {
    if (this._isOnline()) {
      return this._api.deleteComment({ comment: comment.toRAW() }).then(() => {
        this._store.removeComment({ key: comment.id });
      });
    } else {
      this._store.removeComment({ key: comment.id });
      return Promise.resolve(true);
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms().then(films => {
        films.map(film =>
          this._store.updateAllFilms({
            key: film.id,
            item: ModelMovie.parseMovie(film)
          })
        );
        return ModelMovie.parseMovies(films);
      });
    } else {
      /// TODO: TBD
      const rawFilmsMap = this._store.getAll();
      console.log({ rawFilmsMap });
      const rawFilms = objectToArray(rawFilmsMap);
      console.log({ rawFilms });
      const films = ModelMovie.parseMovies(rawFilms);

      return Promise.resolve(films);
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }
  syncFilms() {
    // TODO: what's being sent to syncFilms?
    return this._api.syncFilms({ films: objectToArray(this._store.getAll()) });
  }
};
