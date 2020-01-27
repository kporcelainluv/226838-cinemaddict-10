import AbstractComponent from './abstract-component.js';
export class EmptyFilms extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<h1 class="movie-list-error">There are no movies in our database</h1>`;
  }
}
