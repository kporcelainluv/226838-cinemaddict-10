import {AbstractComponent} from "./abstractComponent";
export class Footer extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<footer class="footer">
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>
</footer>`;
  }

  updateFilmsAmount(amount) {
    this.getElement().querySelector(
        `.footer__statistics p`
    ).innerHTML = `${amount} movies inside`;
  }
}
