import { sort } from "ramda";
import { NavTab, Position, StatsFilterType, StatsRank } from "./consts";
import { addMonths, addWeeks, addYears, isAfter, startOfToday } from "date-fns";
import { Movie } from "./models/films";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays
} from "date-fns";
export const createElement = template => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = element => {
  if (element) {
    element.remove();
  }
};

export const countHoursAndMins = initialMinutes => {
  const hours = Math.floor(initialMinutes / 60);
  const minutes = initialMinutes - hours * 60;
  return [hours, minutes];
};

export const getDateByFilterType = filterType => {
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
};

export const getFilmsByFilter = (films, filterType) => {
  const date = getDateByFilterType(filterType);
  return films.filter(film => {
    const watchDate = Movie.getWatchingDate(film);
    return isAfter(watchDate, date);
  });
};

export const getWatchedFilms = films => {
  return films.length;
};

export const getHoursAndMins = films => {
  const duration = films.reduce((acc, elm) => {
    return acc + Movie.getRuntime(elm);
  }, 0);
  const [hours, minutes] = countHoursAndMins(duration);
  return [hours, minutes];
};

const getSortedGenres = films => {
  const genres = films.reduce((acc, elm) => {
    const genresList = Movie.getGenres(elm);
    genresList.forEach(genre => {
      if (genre in acc) {
        acc[genre] += 1;
      } else {
        acc[genre] = 1;
      }
    });

    return acc;
  }, {});

  return Object.entries(genres).sort((a, b) => {
    if (a[1] > b[1]) {
      return -1;
    } else if (a[1] < b[1]) {
      return 1;
    }
    return 0;
  });
};

export const getGenresByKeysVals = films => {
  const genres = getSortedGenres(films);

  const keys = genres.map(elm => elm[0]);
  const values = genres.map(elm => elm[1]);
  return [keys, values];
};

export const getTopGenre = films => {
  if (films.length < 1) {
    return "—";
  }
  const genres = getSortedGenres(films);
  console.log({ films, genres });
  return genres[0][0];
};

export const getTopRatedFilms = films => {
  if (films.every(film => Movie.getRating(film) === 0)) {
    return 0;
  }
  return sort((a, b) => {
    if (Movie.getRating(a) > Movie.getRating(b)) {
      return -1;
    }
    if (Movie.getRating(a) < Movie.getRating(b)) {
      return 1;
    }
    return 0;
  }, films);
};

export const getMostCommentedFilms = films => {
  if (films.every(film => Movie.getCommentsLength(film) === 0)) {
    return false;
  }
  return sort((a, b) => {
    if (Movie.getCommentsLength(a) > Movie.getCommentsLength(b)) {
      return -1;
    }
    if (Movie.getCommentsLength(a) < Movie.getCommentsLength(b)) {
      return 1;
    }
    return 0;
  }, films);
};

export const sortByDefault = films => {
  return films.sort((a, b) => {
    if (parseInt(a.id) > parseInt(b.id)) {
      return 1;
    } else if (parseInt(a.id) < parseInt(b.id)) {
      return -1;
    }
    return 0;
  });
};

export const sortByDate = films => {
  return films.sort((a, b) => {
    return (
      parseInt(Movie.getReleaseDate(a), 10) -
      parseInt(Movie.getReleaseDate(b), 10)
    );
  });
};

export const sortByRating = films => {
  return films.sort((a, b) => {
    return parseInt(Movie.getRating(a), 10) - parseInt(Movie.getRating(b), 10);
  });
};

export const filterFilms = (films, query) => {
  const formattedQuery = query.toLowerCase().replace(/[^A-Z0-9]+/gi, ``);
  return films.filter(film =>
    Movie.getTitle(film)
      .toLowerCase()
      .includes(formattedQuery)
  );
};
export const filterFilmsbyTab = (navTab, allFilms) => {
  const f = (() => {
    if (navTab === NavTab.WATCHLIST) {
      return getWatchlist;
    } else if (navTab === NavTab.HISTORY) {
      return getWatched;
    } else if (navTab === NavTab.FAVORITES) {
      return getFavorite;
    } else {
      return x => x;
    }
  })();

  return f(allFilms);
};

export const updateFilms = (films, updatedFilm) => {
  return films.reduce((newFilms, film) => {
    if (film.id === updatedFilm.id) {
      return [...newFilms, updatedFilm];
    }
    return [...newFilms, film];
  }, []);
};

export const getStatsRank = watchedAmount => {
  if (watchedAmount < 10) {
    return StatsRank.NOVICE;
  } else if (watchedAmount < 20) {
    return StatsRank.FAN;
  } else if (watchedAmount >= 20) {
    return StatsRank.MOVIEBUFF;
  }
};
export const countWatchedFilms = films => {
  return films.filter(film => Movie.getWatched(film) === true).length;
};

export const getWatched = films => films.filter(film => Movie.getWatched(film));
export const getWatchlist = films =>
  films.filter(film => Movie.getWatchlist(film));
export const getFavorite = films =>
  films.filter(film => Movie.getFavorite(film));

export const getDistanceInWords = (dateLeft, dateRight) => {
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
};
