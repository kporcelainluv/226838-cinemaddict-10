import AbstractComponent from "./abstract-component.js";

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="default">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="date">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="rating">Sort by rating</a></li>
    </ul>`;
  }

  makeButtonStateActive(type) {
    this.getElement()
      .querySelector(`.sort__button--active`)
      .classList.remove(`sort__button--active`);

    const sortButtons = this.getElement().querySelectorAll(`.sort__button`);
    const index = Array.from(sortButtons).findIndex(
      button => button.dataset.sortType === type
    );
    sortButtons[index].classList.add(`sort__button--active`);
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
  onSortBtnClick(callback) {
    const sortButtons = this.getElement().querySelectorAll(`.sort__button`);

    Array.from(sortButtons).forEach(button =>
      button.addEventListener(`click`, callback)
    );
  }
}
