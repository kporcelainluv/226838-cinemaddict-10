import { ModelMovie } from "./models/films";
import { ModelComment } from "./models/comments";


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
      const currentFilm = film;
      this._store.setItem({ key: currentFilm.id, item: currentFilm });
      return Promise.resolve(ModelMovie.parseMovie(currentFilm));
    }
  }

  createComment({ film, comment }) {
    if (this._isOnline()) {
      return this._api.createComment({ film, comment }).then(updatedComment => {
        this._store.setItem({ key: updatedComment.id, item: updatedComment });
        return updatedComment;
      });
    }
  }

  deleteComment({ comment }) {
    if (this._isOnline()) {
      return this._api.deleteComment({ comment }).then(() => {
        this._store.removeItem({ key: comment.id });
      });
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
      const movies = ModelMovie.parseMovies(rawFilms);

      return Promise.resolve(movies);
    }
  }
  _isOnline() {
    return window.navigator.onLine;
  }
  syncFilms() {
    return this._api.syncFilms({ films: objectToArray(this._store.getAll()) });
  }
};
