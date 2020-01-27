import Utils from "../utils.js";
import ProfileRating from "../components/profile-rating.js";
import SearchController from "./search-controller.js";
import {Position} from "../consts";

const headerElement = document.querySelector(`.header`);

const createHeading = () => {
  const heading = document.createElement(`h1`);
  heading.className = `header__logo logo`;
  heading.innerHTML = `Cinemaddict`;

  return heading;
};

export default class HeaderController {
  constructor({onSearchChange}) {
    this._search = new SearchController(headerElement, onSearchChange);
  }

  init() {
    const heading = createHeading();
    this._search.init();
    Utils.render(headerElement, heading, Position.AFTERBEGIN);
  }

  initProfileStats(films) {
    this._profileStats = Utils.getStatsRank(Utils.countWatchedFilms(films));
    this._profile = new ProfileRating(this._profileStats);
    Utils.render(headerElement, this._profile.getElement(), Position.BEFOREEND);
  }
}
