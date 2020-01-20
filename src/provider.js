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
    if (this._isOnline()) {
      return this._api.updateFilm({ film }).then(updatedFilm => {
        this._store.setItem({ key: updatedFilm.id, item: updatedFilm.toRAW() });
        return updatedFilm;
      });
    } else {
      this._store.setItem({ key: film.id, item: film });
      return Promise.resolve(ModelMovie.parseMovie(film));
    }
  }

  createComment({ film, comment }) {
    if (this._isOnline()) {
      return this._api.createComment({ film, comment }).then(updatedComment => {
        this._store.setItem({
          key: updatedComment.id,
          item: updatedComment.toRAW()
        });
        return updatedComment;
      });
    } else {
      // comment.id = this._generateId();
      comment.id = "647837";
      this._store.setItem({ key: comment.id, item: comment });
      return Promise.resolve(ModelComment.parseComment(comment));
    }
  }

  deleteComment({ comment }) {
    if (this._isOnline()) {
      return this._api.deleteComment({ comment }).then(() => {
        this._store.removeItem({ key: comment.id });
      });
    } else {
      this._store.removeItem({ key: comment.id });
      return Promise.resolve(true);
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms().then(films => {
        films.map(film =>
          this._store.setItem({ key: film.id, item: film.toRAW() })
        );
        return films;
      });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const tasks = ModelMovie.parseMovies(rawFilms);

      return Promise.resolve(tasks);
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }
  syncFilms() {
    return this._api.syncFilms({ films: objectToArray(this._store.getAll()) });
  }
};
