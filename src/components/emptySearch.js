import {AbstractComponent} from "./abstractComponent";
export class EmptySearch extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<div class="no-result">
        There are no movies per your request.
      </div>`;
  }
}
