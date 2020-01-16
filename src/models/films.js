export class Movie {
  static getTitle(film) {
    return film.film_info.title;
  }
  static getAlternativeTitle(film) {
    return film.film_info.alternative_title;
  }
  static getAgeRating(film) {
    return film.film_info.age_rating;
  }

  static getDirector(film) {
    return film.film_info.director;
  }
  static getWriters(film) {
    return film.film_info.writers;
  }
  static getActors(film) {
    return film.film_info.actors;
  }
  static getReleaseDate(film) {
    return film.film_info.release.date;
  }
  static getReleaseCountry(film) {
    return film.film_info.release.release_country;
  }

  static getPoster(film) {
    return film.film_info.poster;
  }

  static getRating(film) {
    return film.film_info.total_rating;
  }
  static getRuntime(film) {
    return film.film_info.runtime;
  }
  static getGenres(film) {
    return film.film_info.genre;
  }
  static getDescriptionText(film) {
    return film.film_info.description;
  }
  static getWatchlist(film) {
    return film.user_details.watchlist;
  }
  static getWatched(film) {
    return film.user_details.already_watched;
  }
  static getFavorite(film) {
    return film.user_details.favorite;
  }
  static getCommentsLength(film) {
    return film.comments.length;
  }
  static getComments(film) {
    return film.comments;
  }
  static getPersonalRating(film) {
    return film.user_details.personal_rating;
  }
  static getWatchingDate(film) {
    return film.user_details.watching_date;
  }

  static getUserDetails(film) {
    return film.user_details;
  }
  static markWatched(film) {
    const filmCopy = {...film};
    const userDetailsCopy = {...Movie.getUserDetails(film)};
    userDetailsCopy[`already_watched`] = !Movie.getWatched(film);
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markWatchList(film) {
    const filmCopy = {...film};
    const userDetailsCopy = {...Movie.getUserDetails(film)};
    userDetailsCopy[`watchlist`] = !Movie.getWatchlist(film);
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markFavorite(film) {
    const filmCopy = {...film};
    const userDetailsCopy = {...Movie.getUserDetails(film)};
    userDetailsCopy[`favorite`] = !Movie.getFavorite(film);
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markPersonalRating(film, personalRating) {
    const filmCopy = {...film};
    const userDetailsCopy = {...Movie.getUserDetails(film)};
    userDetailsCopy[`personal_rating`] = Number(personalRating);
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
}
