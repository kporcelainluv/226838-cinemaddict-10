import { Method } from "./consts";

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

export default class API {
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
    }).then(toJSON);
  }

  _getComments(url) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.GET
    }).then(toJSON);
  }

  _update(url, body) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: Method.PUT,
      body
    }).then(toJSON);
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
      .map(f => {
        return f.id;
      })
      .map(id => {
        return this._getComments(`comments/${id}`);
      });

    const allFilmsComments = await Promise.all(commentsPromises);
    films.forEach((film, index) => {
      film.comments = allFilmsComments[index];
    });

    return films;
  }

  updateFilm({ film }) {
    return this._update(`movies/${film.id}`, JSON.stringify(film));
  }

  createComment({ film, comment }) {
    return this._create(`comments/${film.id}`, JSON.stringify(comment));
  }

  deleteComment({ comment }) {
    return this._delete(`comments/${comment.id}`);
  }
  syncFilms(films) {
    return fetchWrapper({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      endpoint: this._endPoint,
      authorization: this._authorization
    }).then(toJSON);
  }
}
