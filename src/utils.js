import { sort } from "ramda";
import { POSITION, STATS_FILTER_TYPE, STATS_RANK } from "./consts";
import { addMonths, addWeeks, addYears, isAfter, startOfToday } from "date-fns";

export const createElement = template => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case POSITION.afterbegin:
      container.prepend(element);
      break;
    case POSITION.beforeend:
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

  if (filterType === STATS_FILTER_TYPE.all) {
    return addYears(today, -100);
  } else if (filterType === STATS_FILTER_TYPE.year) {
    return addYears(today, -1);
  } else if (filterType === STATS_FILTER_TYPE.month) {
    return addMonths(today, -1);
  } else if (filterType === STATS_FILTER_TYPE.week) {
    return addWeeks(today, -1);
  } else if (filterType === STATS_FILTER_TYPE.today) {
    return startOfToday();
  }
  return false;
};

export const getFilmsByFilter = (films, filterType) => {
  const date = getDateByFilterType(filterType);
  return films.filter(film => {
    const watchDate = film.user_details.watching_date;
    return isAfter(watchDate, date);
  });
};

export const getWatchedFilms = films => {
  return films.length;
};

export const getHoursAndMins = films => {
  const duration = films.reduce((acc, elm) => {
    return acc + elm.film_info.runtime;
  }, 0);
  const [hours, minutes] = countHoursAndMins(duration);
  return [hours, minutes];
};

const getSortedGenres = films => {
  const genres = films.reduce((acc, elm) => {
    const genresList = elm.film_info.genre;
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
  const genres = getSortedGenres(films);
  return genres[0][0];
};

export const getTopRatedFilms = films => {
  if (films.every(film => film.film_info.total_rating === 0)) {
    return 0;
  }
  return sort((a, b) => {
    if (a.film_info.total_rating > b.film_info.total_rating) {
      return -1;
    }
    if (a.film_info.total_rating < b.film_info.total_rating) {
      return 1;
    }
    return 0;
  }, films);
};

export const getMostCommentedFilms = films => {
  if (films.every(film => film.comments.length === 0)) {
    return false;
  }
  return sort((a, b) => {
    if (a.comments > b.comments) {
      return -1;
    }
    if (a.comments < b.comments) {
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
      parseInt(a.film_info.release.date, 10) -
      parseInt(b.film_info.release.date, 10)
    );
  });
};

export const sortByRating = films => {
  return films.sort((a, b) => {
    return (
      parseInt(a.film_info.total_rating, 10) -
      parseInt(b.film_info.total_rating, 10)
    );
  });
};

export const filterFilms = (films, query) => {
  const formattedQuery = query.toLowerCase().replace(/[^A-Z0-9]+/gi, ``);
  return films.filter(film =>
    film.film_info.title.toLowerCase().includes(formattedQuery)
  );
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
    return STATS_RANK.novice;
  } else if (watchedAmount < 20) {
    return STATS_RANK.fan;
  } else if (watchedAmount >= 20) {
    return STATS_RANK.movieBuff;
  }
};
export const countWatchedFilms = films => {
  return films.filter(film => film.user_details.already_watched === true)
    .length;
};

export const getWatched = films =>
  films.filter(element => element.user_details.already_watched);
export const getWatchlist = films =>
  films.filter(element => element.user_details.watchlist);
export const getFavorite = films =>
  films.filter(element => element.user_details.favorite);
