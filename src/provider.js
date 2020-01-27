import ModelMovie from "./models/model-movie.js";
import ModelComment from "./models/model-comments.js";
import Utils from "./utils.js";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  updateFilm({film}) {
    if (this._isOnline()) {
      return this._api
        .updateFilm({film: ModelMovie.toRAW(film)})
        .then((updatedFilm) => ModelMovie.parseMovie(updatedFilm))
        .then((updatedFilm) => {
          this._store.setItem({
            key: updatedFilm.id,
            item: updatedFilm
          });
          return updatedFilm;
        });
    }
    this._isSynchronized = false;
    this._store.setItem({
      key: film.id,
      item: film
    });
    return Promise.resolve(film);
  }

  createComment({film, comment, films}) {
    if (this._isOnline()) {
      return this._api
        .createComment({film, comment: ModelComment.toRAW(comment)})
        .then((response) => {
          const movie = Object.assign({}, response.movie);
          movie[`comments`] = response.comments;
          const updatedFilm = ModelMovie.parseMovie(movie);
          const newFilms = Utils.updateFilms(films, updatedFilm);
          newFilms.map((newFilm) => {
            this._store.setItem({
              key: newFilm.id,
              item: newFilm
            });
          });
          return ModelComment.parseComments(response.comments);
        });
    }
    comment.id = Utils.getRandomId();
    const newComment = ModelComment.parseComment(comment);
    this._isSynchronized = false;
    let filmComments = Object.values(films).filter((currentFilm) => {
      return currentFilm.id === film.id;
    })[0].comments;
    filmComments = [...filmComments, newComment];
    const updatedFilm = Object.assign({}, film);
    updatedFilm[`comments`] = filmComments;

    const updatedFilms = Utils.updateFilms(films, updatedFilm);
    updatedFilms.map((newFilm) => {
      this._store.setItem({
        key: newFilm.id,
        item: newFilm
      });
    });

    return Promise.resolve(filmComments);
  }

  deleteComment({comment, film, films}) {
    if (this._isOnline()) {
      return this._api
        .deleteComment({comment: ModelComment.toRAW(comment)})
        .then(() => {
          this._isSynchronized = false;
          const updatedFilms = Utils.updateFilms(films, film);
          updatedFilms.map((newFilm) => {
            this._store.setItem({
              key: newFilm.id,
              item: newFilm
            });
          });
        });
    }
    const updatedFilms = Utils.updateFilms(films, film);
    this._isSynchronized = false;
    updatedFilms.map((newFilm) => {
      this._store.setItem({
        key: newFilm.id,
        item: newFilm
      });
    });

    return Promise.resolve(updatedFilms);
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms().then((films) => {
        films.map((film) => {
          const newFilm = Object.assign({}, film);
          newFilm[`comments`] = ModelComment.parseComments(film.comments);
          this._store.setItem({
            key: newFilm.id,
            item: newFilm
          });
        });
        return films.slice(0).map((film) => {
          const newFilm = Object.assign({}, film);
          newFilm[`comments`] = ModelComment.parseComments(film.comments);
          return newFilm;
        });
      });
    }
    const rawFilmsMap = this._store.getAll();
    const rawFilms = objectToArray(rawFilmsMap);
    const films = ModelMovie.parseMovies(rawFilms);

    return Promise.resolve(films);
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  isSynchronized() {
    return this._isSynchronized;
  }

  syncFilms() {
    const films = Object.values(this._store.getAll());
    const commentsRaw = films.map((film) => {
      return film.comments;
    });
    const filmsRaw = films.map((film) => ModelMovie.toRAW(film));
    filmsRaw.forEach((elm, index) => {
      elm.comments = commentsRaw[index];
    });
    // eslint-disable-next-line consistent-return
    return this._api.syncFilms(filmsRaw).then((result) => {
      const updatedResult = result.updated;
      this._isSynchronized = true;
      if (result) {
        const newFilms = ModelMovie.parseMovies(Object.values(updatedResult));

        return Promise.resolve(newFilms);
      }
      return true;
    });
  }
}
