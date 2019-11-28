import { PageController } from "./controllers/page-controller";
import { API } from "./api";
import { Provider } from "./provider";
import { Store } from "./store";
import { AUTHORIZATION, TASKS_STORE_KEY, END_POINT } from "./consts";
import { mockFilms, zeromockFilms } from "./mockData";

const headerSearchContainer = document.querySelector(`.header`);
const mainPageContainer = document.querySelector(`.main`);

const api = new API({ endPoint: END_POINT, authorization: AUTHORIZATION });
const store = new Store({ key: TASKS_STORE_KEY, storage: localStorage });
const provider = new Provider({
  api,
  store,
  generateId: () => String(Date.now() + Math.random())
});

const page = new PageController(
  headerSearchContainer,
  mainPageContainer,
  [],
  provider
);
page.init();

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});

provider.getFilms().then(films => page.initWithFilms(films));
// page.initWithFilms(zeromockFilms);
