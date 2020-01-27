import {sort} from "ramda";
import DOMPurify from "dompurify";
import {NavTab, Position, StatsFilterType, StatsRank} from "./consts";
import {addMonths, addWeeks, addYears, isAfter, startOfToday} from "date-fns";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO
} from "date-fns";

export default class Utils {
  static createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }
  static render(container, element, place) {
    switch (place) {
      case Position.AFTERBEGIN:
        container.prepend(element);
        break;
      case Position.BEFOREEND:
        container.append(element);
        break;
    }
  }
  static unrender(element) {
    if (element) {
      element.remove();
    }
  }

  static countHoursAndMins(initialMinutes) {
    const hours = Math.floor(initialMinutes / 60);
    const minutes = initialMinutes - hours * 60;
    return [hours, minutes];
  }

  static getDateByFilterType(filterType) {
    const today = new Date();

    if (filterType === StatsFilterType.ALL) {
      return addYears(today, -100);
    } else if (filterType === StatsFilterType.YEAR) {
      return addYears(today, -1);
    } else if (filterType === StatsFilterType.MONTH) {
      return addMonths(today, -1);
    } else if (filterType === StatsFilterType.WEEK) {
      return addWeeks(today, -1);
    } else if (filterType === StatsFilterType.TODAY) {
      return startOfToday();
    }
    return false;
  }

  static getFilmsByFilter(films, filterType) {
    const date = this.getDateByFilterType(filterType);
    return films.filter((film) => {
      const watchDate = film.viewedDate;
      return isAfter(parseISO(watchDate), date);
    });
  }

  static getWatchedFilms(films) {
    return films.length;
  }

  static getHoursAndMins(films) {
    const duration = films.reduce((runtimeList, elm) => {
      return runtimeList + elm.runtime;
    }, 0);
    const [hours, minutes] = this.countHoursAndMins(duration);
    return [hours, minutes];
  }

  static getSortedGenres(films) {
    const genres = films.reduce((newGenresList, elm) => {
      const genresList = elm.genres;
      genresList.forEach((genre) => {
        if (genre in newGenresList) {
          newGenresList[genre] += 1;
        } else {
          newGenresList[genre] = 1;
        }
      });

      return newGenresList;
    }, {});

    return Object.entries(genres).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      } else if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });
  }

  static getGenresByKeysVals(films) {
    const genres = this.getSortedGenres(films);

    const keys = genres.map((elm) => elm[0]);
    const values = genres.map((elm) => elm[1]);
    return [keys, values];
  }

  static getTopGenre(films) {
    if (films.length < 1) {
      return `—`;
    }
    const genres = this.getSortedGenres(films);
    return genres[0][0];
  }
  static getTopRatedFilms(films) {
    if (films.every((film) => film.rating === 0)) {
      return 0;
    }
    return sort((a, b) => {
      if (a.rating > b.rating) {
        return -1;
      }
      if (a.rating < b.rating) {
        return 1;
      }
      return 0;
    }, films);
  }

  static getMostCommentedFilms(films) {
    if (films.every((film) => film.comments.length === 0)) {
      return false;
    }
    return sort((a, b) => {
      if (a.comments.length > b.comments.length) {
        return -1;
      }
      if (a.comments.length < b.comments.length) {
        return 1;
      }
      return 0;
    }, films);
  }
  static sortByDefault(films) {
    return films.sort((a, b) => {
      // eslint-disable-next-line radix
      if (parseInt(a.id, 10) > parseInt(b.id, 10)) {
        return 1;
        // eslint-disable-next-line radix
      } else if (parseInt(a.id, 10) < parseInt(b.id, 10)) {
        return -1;
      }
      return 0;
    });
  }

  static sortByDate(films) {
    return films.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      }
      return 0;
    });
  }

  static sortByRating(films) {
    return films.sort((a, b) => {
      if (parseFloat(a.rating) > parseFloat(b.rating)) {
        return -1;
      } else if (parseFloat(a.rating) < parseFloat(b.rating)) {
        return 1;
      }
      return 0;
    });
  }
  static filterFilms(films, query) {
    const formattedQuery = query.toLowerCase().replace(/[^A-Z0-9]+/gi, ``);
    return films.filter((film) =>
      film.title.toLowerCase().includes(formattedQuery)
    );
  }

  static filterFilmsbyTab(navTab, allFilms) {
    const f = (() => {
      if (navTab === NavTab.WATCHLIST) {
        return this.getWatchlist;
      } else if (navTab === NavTab.HISTORY) {
        return this.getWatched;
      } else if (navTab === NavTab.FAVORITES) {
        return this.getFavorite;
      } else {
        return (x) => x;
      }
    })();

    return f(allFilms);
  }

  static updateFilms(films, updatedFilm) {
    return films.reduce((newFilms, film) => {
      if (film.id === updatedFilm.id) {
        return [...newFilms, updatedFilm];
      }
      return [...newFilms, film];
    }, []);
  }

  static getStatsRank(watchedAmount) {
    if (watchedAmount < 10) {
      return StatsRank.NOVICE;
    } else if (watchedAmount < 20) {
      return StatsRank.FAN;
    } else if (watchedAmount >= 20) {
      return StatsRank.MOVIEBUFF;
    }
    return true;
  }
  static countWatchedFilms(films) {
    return films.filter((film) => film.isWatched === true).length;
  }

  static getWatched(films) {
    return films.filter((film) => film.isWatched);
  }
  static getWatchlist(films) {
    return films.filter((film) => film.isWatchlist);
  }
  static getFavorite(films) {
    return films.filter((film) => film.isFavorite);
  }

  static getDistanceInWords(dateLeft, dateRight) {
    const differenceinSeconds = differenceInSeconds(dateRight, dateLeft);
    const differenceinMinutes = differenceInMinutes(dateRight, dateLeft);
    const differenceinHours = differenceInHours(dateRight, dateLeft);
    const differenceinDays = differenceInDays(dateRight, dateLeft);

    if (differenceinDays >= 1) {
      return `${differenceinDays} days ago`;
    } else if (differenceinHours >= 2) {
      return `a few hours ago`;
    } else if (differenceinHours >= 1) {
      return `an hour ago`;
    } else if (differenceinMinutes >= 4) {
      return `a few minutes ago`;
    } else if (differenceinMinutes >= 1) {
      return `a minute ago`;
    } else if (differenceinSeconds >= 0 && differenceinSeconds < 60) {
      return `now`;
    }
    return true;
  }

  static handleScreening(array) {
    if (array.length === 0) {
      return [];
    }
    return array.map((elem) => DOMPurify.sanitize(elem));
  }

  static markWatched(film) {
    const currentViewDate = film.viewedDate ? film.viewedDate : new Date();
    const updatedFilm = Object.assign({}, film);
    updatedFilm.isWatched = !film.isWatched;
    updatedFilm.viewedDate = currentViewDate;
    return updatedFilm;
  }
  static markWatchList(film) {
    const currentViewDate = film.viewedDate ? film.viewedDate : new Date();
    const updatedFilm = Object.assign({}, film);
    updatedFilm.isWatchlist = !film.isWatchlist;
    updatedFilm.viewedDate = currentViewDate;
    return updatedFilm;

  }
  static markFavorite(film) {
    const currentViewDate = film.viewedDate ? film.viewedDate : new Date();
    const updatedFilm = Object.assign({}, film);
    updatedFilm.isFavorite = !film.isFavorite;
    updatedFilm.viewedDate = currentViewDate;
    return updatedFilm;
  }
  static markPersonalRating(film, personalRating) {
    const currentViewDate = film.viewedDate ? film.viewedDate : new Date();
    const updatedFilm = Object.assign({}, film);
    updatedFilm.personalRating = Number(personalRating);
    updatedFilm.viewedDate = currentViewDate;
    return updatedFilm;
  }
  static getRandomId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}
