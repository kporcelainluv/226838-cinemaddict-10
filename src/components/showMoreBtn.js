import { AbstractComponent } from "./abstractComponent";
class ShowMoreButton extends AbstractComponent {
  constructor() {
    super();
    this.callback = undefined;
    this.onClickShowMore = this.onClickShowMore.bind(this);
    this.removeOnShowMoreCallback = this.removeOnShowMoreCallback.bind(this);
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
  onClickShowMore(callback) {
    if (this.callback) {
      this.removeOnShowMoreCallback(this.callback);
    }
    this.getElement().addEventListener(`click`, callback);
    this.callback = callback;
  }
  removeOnShowMoreCallback(callback) {
    this.getElement().removeEventListener(`click`, callback);
  }
}
export { ShowMoreButton };
