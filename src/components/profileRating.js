import {AbstractComponent} from "./abstractComponent";

export class ProfileRating extends AbstractComponent {
  constructor(stats) {
    super();
    this._profileStats = stats;
  }
  getTemplate() {
    return `<section class="header__profile profile">
  <p class="profile__rating">${this._profileStats}</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
