export class Movie {
  static getWatchingDate(film) {
    return film.viewedDate;
  }

  static getUserDetails(film) {
    return film.user_details;
  }
  static markWatched(film) {
    const filmCopy = { ...film };
    const userDetailsCopy = { ...Movie.getUserDetails(film) };
    userDetailsCopy[`already_watched`] = !film.isWatched;
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markWatchList(film) {
    const filmCopy = { ...film };
    const userDetailsCopy = { ...Movie.getUserDetails(film) };
    userDetailsCopy[`watchlist`] = !film.isWatchlist;
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markFavorite(film) {
    const filmCopy = { ...film };
    const userDetailsCopy = { ...Movie.getUserDetails(film) };
    userDetailsCopy[`favorite`] = !film.isFavorite;
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
  static markPersonalRating(film, personalRating) {
    const filmCopy = { ...film };
    const userDetailsCopy = { ...Movie.getUserDetails(film) };
    userDetailsCopy[`personal_rating`] = Number(personalRating);
    filmCopy[`user_details`] = userDetailsCopy;
    return filmCopy;
  }
}
