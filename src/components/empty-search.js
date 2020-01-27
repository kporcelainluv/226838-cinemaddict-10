import AbstractComponent from "./abstract-component.js";
export default class EmptySearch extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<div class="no-result">
        There are no movies per your request.
      </div>`;
  }
}
