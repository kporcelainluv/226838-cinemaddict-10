import {Footer} from "../components/footerComponent";
import {render} from "../utils";
import {Position} from "../consts";

export class FooterController {
  constructor() {
    this._body = document.getElementsByTagName(`body`)[0];
    this._footer = new Footer();
  }

  init(films) {
    this._footer.updateFilmsAmount(films.length);
    render(this._body, this._footer.getElement(), Position.BEFOREEND);
  }
}
