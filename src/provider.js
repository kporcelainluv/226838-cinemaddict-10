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
        this._store.setItem({ key: updatedFilm.id, item: updatedFilm });
        return updatedFilm;
      });
    } else {
      const currentFilm = film;
      this._store.setItem({ key: currentFilm.id, item: currentFilm });
      return Promise.resolve(film);
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
        films.map(film => this._store.setItem({ key: film.id, item: film }));
        return films;
      });
    } else {
      const filmsMap = this._store.getAll();
      const films = objectToArray(filmsMap);
      return Promise.resolve(films);
    }
  }
  _isOnline() {
    return window.navigator.onLine;
  }
  syncFilms() {
    return this._api.syncFilms({ films: objectToArray(this._store.getAll()) });
  }
};
