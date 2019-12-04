import { difference, head, pipe, sort } from "ramda";
import {
  sortByDate,
  sortByDefault,
  sortByRating,
  filterFilms,
  updateFilms,
  getFavorite,
  getWatched,
  getWatchlist
} from "../utils";
import { NavTab, SEARCH_QUERY_LENGTH, SortType, UpdateType } from "../consts";
import { SearchResultController } from "./search-result";
import { StatsController } from "../controllers/stats-controller";

import { SortController } from "./sort-controller";
import { HeaderController } from "./header-controller";
import { FilmsController } from "./films-controller";
import { FooterController } from "./footer-controller";
import { NavigationController } from "./navigation-controller";

export class PageController {
  constructor(headerContainer, container, films, api) {
    this._container = container;
    this._api = api;
    this._films = films;
    this._allFilms = films;
    this._currentTab = NavTab.ALL;

    this._sortController = new SortController(
      this._container,
      this._onSortTypeChange.bind(this)
    );
    this._headerController = new HeaderController({
      onSearchChange: this._onSearchChange.bind(this)
    });
    this._filmsController = new FilmsController({
      container: this._container,
      onFilmUpdate: this._onFilmUpdate.bind(this)
    });
    this._navigationController = new NavigationController(
      this._container,
      this._onNavigationChange.bind(this)
    );

    this._searchResultContoller = new SearchResultController({
      container: this._container,
      onFilmUpdate: this._onFilmUpdateSearchResult.bind(this)
    });

    this._stats = new StatsController(this._container, this._allFilms);
    this._footer = new FooterController(this._allFilms);
  }

  init() {
    this._headerController.init();
    this._filmsController.init();
    this._sortController.init();
    this._navigationController.init();
  }

  initWithFilms(films) {
    this._films = films;
    this._allFilms = films;

    this._filmsController.initWithFilms(this._films);
    this._headerController.initProfileStats(this._films);
    this._navigationController.initWithFilms(this._films);
    this._searchResultContoller.init(this._films);
    this._stats.init(this._films);
    this._footer.init(this._films);
  }

  _onSearchChange(query) {
    if (query.length >= SEARCH_QUERY_LENGTH) {
      this._films = filterFilms(this._allFilms, query);
      this._filmsController.hide();
      this._sortController.hide();
      this._navigationController.hide();
      this._searchResultContoller.render(this._films);
    } else if (query.length === 0) {
      this._films = this._allFilms;
      this._sortController.show();
      this._navigationController.show();
      this._searchResultContoller.unrender();
      this._filmsController.show();
      this._filmsController.render(this._films);
    }
  }

  _onNavigationChange(navTab) {
    this._currentTab = navTab;

    if (navTab === NavTab.ALL) {
      this._films = this._allFilms;
      this._stats.unrender();
      this._sortController.show();
      this._filmsController.show();
      this._filmsController.renderFilmsContainer(this._films);
    } else if (navTab === NavTab.WATCHLIST) {
      this._films = getWatchlist(this._allFilms);
      this._stats.unrender();
      this._sortController.show();
      this._filmsController.show();
      this._filmsController.renderFilmsContainer(this._films);
    } else if (navTab === NavTab.HISTORY) {
      this._films = getWatched(this._allFilms);
      this._stats.unrender();
      this._sortController.show();
      this._filmsController.show();
      this._filmsController.renderFilmsContainer(this._films);
    } else if (navTab === NavTab.FAVORITES) {
      this._films = getFavorite(this._allFilms);
      this._stats.unrender();
      this._sortController.show();
      this._filmsController.show();
      this._filmsController.renderFilmsContainer(this._films);
    } else if (navTab === NavTab.STATS) {
      this._filmsController.hide();
      this._sortController.hide();
      this._stats.render();
    }
  }

  _onSortTypeChange(sortType) {
    if (sortType === SortType.DEFAULT) {
      this._films = sortByDefault(this._films);
      this._filmsController.render(this._films);
    } else if (sortType === SortType.DATE) {
      this._films = sortByDate(this._films);
      this._filmsController.render(this._films);
    } else if (sortType === SortType.RATING) {
      this._films = sortByRating(this._films);
      this._filmsController.render(this._films);
    }
  }

  _onFilmUpdateSearchResult(updatedFilm) {
    this._films = updateFilms(this._films, updatedFilm);
    this._allFilms = updateFilms(this._allFilms, updatedFilm);

    this._searchResultContoller.render(this._films);
  }
  /* eslint-disable consistent-return */
  _onFilmUpdate(updatedFilm, meta) {
    const { updateType, onSuccess, onError } = meta;

    const rerender = newFilm => {
      this._films = updateFilms(this._films, newFilm);
      this._allFilms = updateFilms(this._allFilms, newFilm);

      this._filmsController.render(this._films);
      this._navigationController.render(this._allFilms, this._currentTab);
    };

    if (updateType === UpdateType.DELETECOMMENT) {
      const deletedComment = difference(
        this._films.find(f => f.id === updatedFilm.id).comments,
        updatedFilm.comments
      )[0];
      return this._api
        .deleteComment({ comment: deletedComment })
        .then(() => rerender(updatedFilm))
        .then(() => onSuccess())
        .catch(() => onError());
    } else if (updateType === UpdateType.UPDATEUSERINFO) {
      return this._api.updateFilm({ film: updatedFilm }).then(() => {
        rerender(updatedFilm);
      });
    } else if (updateType === UpdateType.CREATECOMMENT) {
      const createdComment = difference(
        updatedFilm.comments,
        this._films.find(f => f.id === updatedFilm.id).comments
      )[0];
      console.log({ createdComment });
      return this._api
        .createComment({
          film: updatedFilm,
          comment: createdComment
        })
        .then(({ comments }) => {
          updatedFilm.comments = comments;
          onSuccess(comments);
          rerender(updatedFilm);
        })
        .catch(() => onError());
    }
  }
}
