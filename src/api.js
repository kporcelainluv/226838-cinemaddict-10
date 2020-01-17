import { Method } from "./consts";
import { ModelMovie } from "./models/model-movie";
import { ModelComment } from "./models/model-comments";

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = response => {
  return response.json();
};

const fetchWrapper = ({
  url,
  method = Method.GET,
  body = null,
  endpoint,
  authorization
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: authorization
  };
  return fetch(`${endpoint}/${url}`, { method, body, headers }).then(
    checkStatus
  );
};

export class API {
  constructor({ endPoint, authorization }) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _get(url) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.GET
    })
      .then(toJSON)
      .then(ModelMovie.parseMovies);
  }

  _getComments(url) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.GET
    })
      .then(toJSON)
      .then(ModelComment.parseComments);
  }

  _update(url, body) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.PUT,
      body
    })
      .then(toJSON)
      .then(ModelMovie.parseMovie);
  }

  _create(url, body) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.POST,
      body
    }).then(toJSON);
  }

  _delete(url) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.DELETE
    });
  }

  async getFilms() {
    const films = await this._get(`movies`);

    const commentsPromises = films
      .map(f => f.id)
      .map(id => this._getComments(`comments/${id}`));

    const allFilmsComments = await Promise.all(commentsPromises);
    films.forEach((elm, index) => {
      elm.comments = allFilmsComments[index];
    });

    return films;
  }

  updateFilm({ film }) {
    return this._update(
      `movies/${film.id}`,
      JSON.stringify(ModelMovie.toRAW1(film))
    );
  }

  createComment({ film, comment }) {
    return this._create(
      `comments/${film.id}`,
      JSON.stringify(ModelComment.toRAW1(comment))
    );
  }

  deleteComment({ comment }) {
    return this._delete(`comments/${comment.id}`);
  }
  syncFilms({ films }) {
    console.log("syncFilms", { films });
    return fetchWrapper({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      endpoint: this._endPoint,
      authorization: this._authorization
    }).then(toJSON);
  }
}
