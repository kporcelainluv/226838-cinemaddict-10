import { ModelMovie } from "./models/model-movie";
import { ModelComment } from "./models/model-comments";
import { getRandomId, updateFilms } from "./utils";
import { API } from "./api";

const objectToArray = object => {
  return Object.keys(object).map(id => object[id]);
};

export const Provider = class {
  constructor({ api, store }) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  // done
  updateFilm({ film }) {
    if (this._isOnline()) {
      return this._api
        .updateFilm({ film: ModelMovie.toRAW1(film) })
        .then(updatedFilm => ModelMovie.parseMovie(updatedFilm))
        .then(updatedFilm => {
          this._store.setItem({
            key: updatedFilm.id,
            item: updatedFilm
          });
          return updatedFilm;
        });
    } else {
      this._isSynchronized = false;
      this._store.setItem({
        key: film.id,
        item: film
      });
      return Promise.resolve(film);
    }
  }

  createComment({ film, comment, films }) {
    if (this._isOnline()) {
      return this._api
        .createComment({ film, comment: ModelComment.toRAW1(comment) })
        .then(response => {
          const updatedFilm = ModelMovie.parseMovie({
            ...response.movie,
            comments: response.comments
          });
          const newFilms = updateFilms(films, updatedFilm);
          newFilms.map(film => {
            this._store.setItem({
              key: film.id,
              item: film
            });
          });
          return ModelComment.parseComments(response.comments);
        });
    } else {
      comment.id = getRandomId();
      const newComment = ModelComment.parseComment(comment);
      this._isSynchronized = false;
      let filmComments = Object.values(films).filter(currentFilm => {
        return currentFilm.id === film.id;
      })[0].comments;
      filmComments = [...filmComments, newComment];
      const updatedFilm = { ...film, comments: filmComments };

      const updatedFilms = updateFilms(films, updatedFilm);
      updatedFilms.map(film => {
        this._store.setItem({
          key: film.id,
          item: film
        });
      });

      return Promise.resolve(filmComments);
    }
  }

  deleteComment({ comment, film, films }) {
    if (this._isOnline()) {
      return this._api
        .deleteComment({ comment: ModelComment.toRAW1(comment) })
        .then(() => {
          this._isSynchronized = false;
          const updatedFilms = updateFilms(films, film);
          updatedFilms.map(film => {
            this._store.setItem({
              key: film.id,
              item: film
            });
          });
        });
    } else {
      const updatedFilms = updateFilms(films, film);
      this._isSynchronized = false;
      updatedFilms.map(film => {
        this._store.setItem({
          key: film.id,
          item: film
        });
      });

      return Promise.resolve(updatedFilms);
    }
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms().then(films => {
        films.map(film => {
          const newFilm = {
            ...ModelMovie.parseMovie(film),
            comments: ModelComment.parseComments(film.comments)
          };
          this._store.setItem({
            key: newFilm.id,
            item: newFilm
          });
        });
        const newFilms = films.slice(0).map(film => {
          return {
            ...ModelMovie.parseMovie(film),
            comments: ModelComment.parseComments(film.comments)
          };
        });
        return newFilms;
      });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelMovie.parseMovies(rawFilms);

      return Promise.resolve(films);
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  isSynchronized() {
    return this._isSynchronized;
  }

  syncFilms() {
    const films = Object.values(this._store.getAll());
    const commentsRaw = films.map(film => {
      return film.comments;
    });
    const filmsRaw = films.map(film => ModelMovie.toRAW1(film));
    filmsRaw.forEach((elm, index) => {
      elm.comments = commentsRaw[index];
    });
    return this._api.syncFilms(filmsRaw).then(async result => {
      this._isSynchronized = true;
      if (result) {
        const films = ModelMovie.parseMovies(Object.values(result.updated));

        return Promise.resolve(films);
      }
    });
  }
};
