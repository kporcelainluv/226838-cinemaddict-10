import {AbstractComponent} from "./abstractComponent";

export class DefaultFilmList extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
      </section>
  `;
  }

  getElementToRenderFilmsTo() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
