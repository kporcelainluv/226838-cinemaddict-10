import Footer from "../components/footer-component.js";
import Utils from "../utils.js";
import {Position} from "../consts";

export default class FooterController {
  constructor() {
    this._body = document.getElementsByTagName(`body`)[0];
    this._footer = new Footer();
  }

  init(films) {
    this._footer.updateFilmsAmount(films.length);
    Utils.render(this._body, this._footer.getElement(), Position.BEFOREEND);
  }
}
