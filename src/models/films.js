export class ModelMovie {
  constructor(film) {
    console.log(film);
    this.id = film[`id`];
    this.poster = film[`film_info`][`poster`];
    this.title = film[`film_info`][`title`];
    this.alternativeTitle = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.releaseDate = new Date(film[`film_info`][`release`][`date`]).getTime();
    this.runtime = film[`film_info`][`runtime`];
    this.genres = new Set(film[`film_info`][`genre`]);
    this.description = film[`film_info`][`description`];
    this.comments = film[`comments`] || [];
    this.user = {};
    this.user.watchlist = Boolean(film[`user_details`][`watchlist`]);
    this.user.watched = Boolean(film[`user_details`][`already_watched`]);
    this.user.favorite = Boolean(film[`user_details`][`favorite`]);
    this.user.rating = film[`user_details`][`personal_rating`];
    this.user.watchingDate = new Date(
      film[`user_details`][`watching_date`]
    ).getTime();
    this.director = film[`film_info`][`director`];
    this.writers = film[`film_info`][`writers`];
    this.actors = film[`film_info`][`actors`];
    this.country = film[`film_info`][`release`][`release_country`];
    this.age = film[`film_info`][`age_rating`];
    this.comment = {};
    this.name = film[`author`];
    this.published = new Date(film[`date`]).getTime();
    this.comment = film[`comment`];
    this.emoji = film[`emotion`];
  }

  static parseMovie(data) {
    return new ModelMovie(data);
  }

  static parseMovies(data) {
    return data.map(ModelMovie.parseMovie);
  }

  toRAW() {
    const userDetails = {};
    const filmInfo = {};
    const release = {};
    const comments = {};

    userDetails[`watchlist`] = this.user.watchlist;
    userDetails[`already_watched`] = this.user.watched;
    userDetails[`favorite`] = this.user.favorite;
    userDetails[`personal_rating`] = this.user.rating || 0;
    userDetails[`watching_date`] = new Date(
      this.user.watchingDate
    ).toISOString();
    filmInfo[`poster`] = this.poster;
    filmInfo[`title`] = this.title;
    filmInfo[`alternative_title`] = this.alternativeTitle;
    filmInfo[`total_rating`] = this.rating;
    release[`date`] = new Date(this.releaseDate).toISOString();
    release[`release_country`] = this.country;
    filmInfo[`release`] = release;
    filmInfo[`runtime`] = this.runtime;
    filmInfo[`genre`] = [...this.genres];
    filmInfo[`description`] = this.description;
    filmInfo[`director`] = this.director;
    filmInfo[`writers`] = this.writers;
    filmInfo[`actors`] = this.actors;
    filmInfo[`age_rating`] = this.age;
    comments[`comment`] = this.comment.comment;
    comments[`date`] = new Date(this.comment.published).toISOString();
    comments["emotion"] = this.comment.emoji;

    return {
      id: this.id,
      user_details: userDetails,
      film_info: filmInfo,
      comments: this.comments
    };
  }
}
