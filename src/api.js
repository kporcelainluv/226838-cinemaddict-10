import { METHOD } from "./consts";

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
  method = METHOD.GET,
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

const formatFilmData = film => {
  return {
    ...film,
    comments: film.comments.map(f => f.id),
    user_details: {
      ...film.user_details,
      watching_date: new Date()
    }
  };
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
      method: METHOD.GET
    }).then(toJSON);
  }

  _update(url, body) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: METHOD.PUT,
      body
    }).then(toJSON);
  }

  _create(url, body) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: METHOD.POST,
      body
    }).then(toJSON);
  }

  _delete(url) {
    return fetchWrapper({
      url,
      endpoint: this._endPoint,
      authorization: this._authorization,
      method: METHOD.DELETE
    });
  }

  async getFilms() {
    const films = await this._get(`movies`);

    const commentsPromises = films
      .map(f => f.id)
      .map(id => this._get(`comments/${id}`));

    const allFilmsComments = await Promise.all(commentsPromises);
    films.forEach((elm, index) => {
      elm.comments = allFilmsComments[index];
    });

    return films;
  }

  updateFilm({ film }) {
    return this._update(
      `movies/${film.id}`,
      JSON.stringify(formatFilmData(film))
    );
  }

  createComment({ film, comment }) {
    return this._create(`comments/${film.id}`, JSON.stringify(comment));
  }

  deleteComment({ comment }) {
    return this._delete(`comments/${comment.id}`);
  }
  syncFilms({ films }) {
    return fetchWrapper({
      url: `movies/sync`,
      method: METHOD.POST,
      body: JSON.stringify({ films }),
      endpoint: this._endPoint,
      authorization: this._authorization
    }).then(toJSON);
  }
}
