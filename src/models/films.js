export class Movie {
  static getId(f) {
    return f.id;
  }
  static getTitle(f) {
    return f.film_info.title;
  }
  static getPoster(f) {
    return f.film_info.poster;
  }
  static getReleaseDate(f) {
    return f.film_info.release.date;
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
}

// const [id, poster] = juxt([Movie.getId, Movie.getPoster])(film);
