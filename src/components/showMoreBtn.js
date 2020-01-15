import { AbstractComponent } from "./abstractComponent";
export class ShowMoreButton extends AbstractComponent {
  constructor() {
    super();
    this.callback = undefined;
    this.onShowMoreClick = this.onShowMoreClick.bind(this);
    this.removeShowMoreCallback = this.removeShowMoreCallback.bind(this);
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
  onShowMoreClick(callback) {
    if (this.callback) {
      this.removeShowMoreCallback(this.callback);
    }
    this.getElement().addEventListener(`click`, callback);
    this.callback = callback;
  }
  removeShowMoreCallback(callback) {
    this.getElement().removeEventListener(`click`, callback);
  }
}
