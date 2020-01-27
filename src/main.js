import PageController from "./controllers/page-controller.js";
import API from "./api.js";
import Provider from "./provider.js";
import Store from "./store.js";
import {
  AUTHORIZATION,
  TASKS_STORE_KEY,
  END_POINT,
  ConnectionStatus
} from "./consts";

const headerSearchContainer = document.querySelector(`.header`);
const mainPageContainer = document.querySelector(`.main`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: TASKS_STORE_KEY, storage: localStorage});
const provider = new Provider({
  api,
  store
});

const page = new PageController(
    headerSearchContainer,
    mainPageContainer,
    [],
    provider
);
page.init();

window.addEventListener(ConnectionStatus.OFFLINE, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(ConnectionStatus.ONLINE, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  if (provider.isSynchronized) {
    provider.syncFilms().then((updatedFilms) => {
      page.rerender(updatedFilms);
    });
  }
});

provider.getFilms().then((films) => page.initWithFilms(films));
