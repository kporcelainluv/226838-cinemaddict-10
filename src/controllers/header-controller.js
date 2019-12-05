import {render, getStatsRank, countWatchedFilms} from "../utils";
import {ProfileRating} from "../components/profileRating";
import {SearchController} from "./search-controller";
import {Position} from "../consts";

const headerElement = document.querySelector(`.header`);

const createHeading = () => {
  const heading = document.createElement(`h1`);
  heading.className = `header__logo logo`;
  heading.innerHTML = `Cinemaddict`;

  return heading;
};

export class HeaderController {
  constructor({onSearchChange}) {
    this._search = new SearchController(headerElement, onSearchChange);
  }

  init() {
    const heading = createHeading();
    this._search.init();
    render(headerElement, heading, Position.AFTERBEGIN);
  }

  initProfileStats(films) {
    this._profileStats = getStatsRank(countWatchedFilms(films));
    this._profile = new ProfileRating(this._profileStats);
    render(headerElement, this._profile.getElement(), Position.BEFOREEND);
  }
}
