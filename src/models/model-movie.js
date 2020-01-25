import DOMPurify from "dompurify";
import Utils from "../utils.js";

export class ModelMovie {
  /* eslint-disable camelcase */
  constructor(movie) {
    this.id = movie[`id`];
    this.title = DOMPurify.sanitize(movie[`film_info`][`title`]);
    this.originalTitle =
      DOMPurify.sanitize(movie[`film_info`][`alternative_title`]) || ``;
    this.poster = DOMPurify.sanitize(movie[`film_info`][`poster`]);
    this.description = DOMPurify.sanitize(movie[`film_info`][`description`]);
    this.rating = Number(movie[`film_info`][`total_rating`]);
    this.date = movie[`film_info`][`release`][`date`];
    this.genres = Utils.handleScreening(movie[`film_info`][`genre`]);
    this.ageRate = Number(movie[`film_info`][`age_rating`]);
    this.runtime = Number(movie[`film_info`][`runtime`]);
    this.comments = Utils.handleScreening(movie[`comments`]);
    this.director = DOMPurify.sanitize(movie[`film_info`][`director`]);
    this.writers = Utils.handleScreening(movie[`film_info`][`writers`]);
    this.actors = Utils.handleScreening(movie[`film_info`][`actors`]);
    this.runtime = Number(movie[`film_info`][`runtime`]);
    this.country = DOMPurify.sanitize(
      movie[`film_info`][`release`][`release_country`]
    );
    this.genres = Utils.handleScreening(movie[`film_info`][`genre`]);

    this.personalRating =
      Number(movie[`user_details`][`personal_rating`]) || null;
    this.isFavorite = Boolean(movie[`user_details`][`favorite`]);
    this.isWatchlist = Boolean(movie[`user_details`][`watchlist`]);
    this.isWatched = Boolean(movie[`user_details`][`already_watched`]);
    this.viewedDate = movie[`user_details`][`watching_date`];
    this.comments = movie[`comments`];
  }

  static parseMovie(movie) {
    return new ModelMovie(movie);
  }

  static parseMovies(movie) {
    return movie.map(ModelMovie.parseMovie);
  }

  static toRAW(film) {
    return {
      id: film.id,
      film_info: {
        title: film.title,
        alternative_title: film.originalTitle,
        poster: film.poster,
        description: film.description,
        total_rating: Number(film.rating),
        genre: film.genres,
        age_rating: Number(film.ageRate),
        runtime: Number(film.runtime),
        release: {
          date: new Date(film.date),
          release_country: film.country
        },
        director: film.director,
        writers: film.writers,
        actors: film.actors
      },
      user_details: {
        [`personal_rating`]: Number(film.personalRating),
        favorite: Boolean(film.isFavorite),
        watchlist: Boolean(film.isWatchlist),
        [`already_watched`]: Boolean(film.isWatched),
        [`watching_date`]: new Date(film.viewedDate)
      },
      comments: film.comments.map(comment => comment.id)
    };
  }
}
