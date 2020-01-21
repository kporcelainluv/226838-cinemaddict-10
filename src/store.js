export const Store = class {
  constructor({ key, storage }) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({ key, item }) {
    const items = this.getAll();
    items[key] = item;
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  removeComment({ key }) {
    const films = this.getAll();
    const comments = films.slice(0).map(film => film.comments);
    const newComments = comments.map(comment => {
      if (comment.includes(key)) {
        return comment.filter(commentId => commentId !== key);
      }
    });
    const newFilms = films.map(
      (film, index) => (film.comments = newComments[index])
    );

    this._storage.setItem(this._storeKey, JSON.stringify(newFilms));
  }
  getItem({ key }) {
    const items = this.getAll();
    return items[key];
  }

  addComments({ key, comments }) {
    const films = this.getAll();
    const newFilms = films.map(
      (film, index) => (film.comments = comments[index])
    );
    this._storage.setItem(this._storeKey, JSON.stringify(newFilms));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      console.error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
  updateAllFilms({ key, films }) {
    this._storage.setItem(this._storeKey, JSON.stringify(films));
  }
};
