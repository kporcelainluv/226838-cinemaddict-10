export class Movie {
  static getTitle(f) {
    return f.film_info.title;
  }
  static getAlternativeTitle(f) {
    return f.film_info.alternative_title;
  }
  static getAgeRating(f) {
    return f.film_info.age_rating;
  }

  static getDirector(f) {
    return f.film_info.director;
  }
  static getWriters(f) {
    return f.film_info.writers;
  }
  static getActors(f) {
    return f.film_info.actors;
  }
  static getReleaseDate(f) {
    return f.film_info.release.date;
  }
  static getReleaseCountry(f) {
    return f.film_info.release.release_country;
  }

  static getPoster(f) {
    return f.film_info.poster;
  }

  static getRating(f) {
    return f.film_info.total_rating;
  }
  static getRuntime(f) {
    return f.film_info.runtime;
  }
  static getGenres(f) {
    return f.film_info.genre;
  }
  static getDescriptionText(f) {
    return f.film_info.description;
  }
  static getWatchlist(f) {
    return f.user_details.watchlist;
  }
  static getWatched(f) {
    return f.user_details.already_watched;
  }
  static getFavorite(f) {
    return f.user_details.favorite;
  }
  static getCommentsLength(f) {
    return f.comments.length;
  }
  static getComments(f) {
    return f.comments;
  }
  static getPersonalRating(f) {
    return f.user_details.personal_rating;
  }
  static getWatchingDate(f) {
    return f.user_details.watching_date;
  }

  static getUserDetails(f) {
    return f.user_details;
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
