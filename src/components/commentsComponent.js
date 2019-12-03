import { TIMEOUT } from "../consts";
import moment from "moment";
import { AbstractComponent } from "./abstractComponent";

export class CommentsSection extends AbstractComponent {
  constructor(comments) {
    super();
    this._comments = comments;
    this._commentsLen = comments.length;
  }

  getTemplate() {
    return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${
          this._commentsLen
        }</span></h3>
        <ul class="film-details__comments-list">
        
        ${this._comments.reduce((acc, comment) => {
          acc += `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${
                comment.emotion
              }.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${
                  comment.author
                }</span>
                <span class="film-details__comment-day">${moment(
                  comment.date
                ).format(`YY/MM/DD HH:MM`)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
          return acc;
        }, ``)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
                    <img src="images/emoji/smile.png" width="55" height="55" alt="emoji"></div>

          <label class="film-details__comment-label">

            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
            <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
  `;
  }

  onInputFocus(callback) {
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, callback);
  }

  EmojiOptionHandler(callback) {
    const emojiOptions = this.getElement().querySelectorAll(
      `.film-details__emoji-item`
    );

    Array.from(emojiOptions).forEach(emoji => {
      emoji.addEventListener(`click`, callback);
    });
  }

  EmojiUrlUpdateHandler(newUrl) {
    this.getElement().querySelector(
      `.film-details__add-emoji-label img`
    ).src = newUrl;
  }

  onEachDeleteButtonsClick(callback) {
    const commentList = this.getElement().querySelectorAll(
      `.film-details__comment-delete`
    );
    if (!navigator.onLine) {
      this.disableDeleteButtons();
    }

    Array.from(commentList).forEach((comment, index) => {
      comment.addEventListener(`click`, evt => {
        evt.preventDefault();
        callback(index);
      });
    });
  }
  buttonHeadingHandler(state, index) {
    const button = this.getElement().querySelectorAll(
      `.film-details__comment-delete`
    )[index];

    if (state === `deleting`) {
      button.innerHTML = `Deleting...`;
      button.disabled = true;
    } else {
      button.innerHTML = `Delete`;
      button.disabled = false;
    }
  }
  disableCommentsSection() {
    this.getElement().querySelector(
      `.film-details__comment-input`
    ).disabled = true;
  }
  enableCommentsSection() {
    this.getElement().querySelector(
      `.film-details__comment-input`
    ).disabled = false;
  }
  shakeTextarea() {
    const textarea = this.getElement().querySelector(
      `.film-details__comment-input`
    );
    textarea.style.animation = `shake 0.6s`;
    setTimeout(() => {
      textarea.style.animation = ``;
    }, TIMEOUT);
  }
  toggleRedErrorWrap(state) {
    const textarea = this.getElement().querySelector(
      `.film-details__comment-input`
    );
    if (state === `add`) {
      textarea.style.border = `2px solid red`;
    }
    if (state === `remove`) {
      textarea.style.border = ``;
    }
  }
  disableDeleteButtons() {
    this.getElement()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach(elm => (elm.disabled = true));
  }
  enableDeleteButtons() {
    this.getElement()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach(elm => (elm.disabled = false));
  }
}
