export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, item}) {
    const store = this.getAll();
    const newValue = {};
    Object.assign(newValue, store, {[key]: item});
    this._storage.setItem(this._storeKey, JSON.stringify(newValue));
  }

  getAll() {
    try {
      const store = this._storage.getItem(this._storeKey);
      if (store) {
        return JSON.parse(store);
      }
      return {};
    } catch (error) {
      return {};
    }
  }
}
