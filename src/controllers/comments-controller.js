import { CommentsSection } from "../components/comments-component";
import { render, unrender } from "../utils";
import { UpdateType, Position, DeleteButtonName, ENTER_KEY } from "../consts";

const EMOJI = {
  "emoji-smile": `smile`,
  "emoji-sleeping": `sleeping`,
  "emoji-gpuke": `puke`,
  "emoji-angry": `angry`
};

export class CommentsController {
  constructor(popup, comments, onCommentsChange) {
    this._popup = popup;
    this._onCommentsChange = onCommentsChange;
    this._comments = comments;

    this._commentsSection = new CommentsSection(comments);
    this._currentEmoji = undefined;

    this.init = this.init.bind(this);
    this._rerender = this._rerender.bind(this);
    this._unrender = this._unrender.bind(this);
    this._render = this._render.bind(this);
  }

  _render() {
    render(
      this._popup.getCommentsContainer(),
      this._commentsSection.getElement(),
      Position.BEFOREEND
    );
  }

  _unrender() {
    unrender(this._commentsSection.getElement());
    this._commentsSection.removeElement();
  }

  _rerender(comments) {
    this._unrender();
    this._commentsSection = new CommentsSection(comments);

    this.init();
  }

  init() {
    window.addEventListener(`offline`, () => {
      this._commentsSection.disableCommentsSection();
    });
    window.addEventListener(`online`, () => {
      this._commentsSection.enableCommentsSection();
    });

    this._commentsSection.onEachDeleteButtonsClick(index => {
      this._commentsSection.buttonHeadingHandler(
        DeleteButtonName.DELETING,
        index
      );
      this._comments = [
        ...this._comments.slice(0, index),
        ...this._comments.slice(index + 1)
      ];
      this._render();

      this._onCommentsChange(this._comments, {
        updateType: UpdateType.DELETECOMMENT,
        onSuccess: () => {
          this._rerender(this._comments);
        },
        onError: () => {
          this._commentsSection.buttonHeadingHandler(
            DeleteButtonName.DELETE,
            index
          );
        }
      });
    });

    this._render();

    this._commentsSection.emojiOptionHandler(evt => {
      evt.preventDefault();
      const emojiId = evt.target.id;
      this._currentEmoji = EMOJI[emojiId];
      this._commentsSection.emojiUrlUpdateHandler(this._currentEmoji);
    });

    const onAddComment = evt => {
      if (
        (evt.ctrlKey && evt.keyCode === ENTER_KEY) ||
        (evt.keyCode === ENTER_KEY && evt.metaKey)
      ) {
        this._commentsSection.toggleRedErrorWrap(`remove`);

        const formData = new FormData(this._popup.getFormElement());
        const newComment = {
          emotion: this._currentEmoji || `smile`,
          comment: formData.get(`comment`),
          author: `Your comment`,
          date: new Date().toISOString()
        };
        if (newComment.comment) {
          this._commentsSection.disableCommentsSection();
          this._comments = [...this._comments, newComment];

          this._onCommentsChange(this._comments, {
            updateType: UpdateType.CREATECOMMENT,
            onSuccess: comments => {
              this._commentsSection.enableCommentsSection();
              document.removeEventListener(`keydown`, onAddComment);
              this._rerender(comments);
            },
            onError: () => {
              this._commentsSection.disableCommentsSection();
              this._commentsSection.shakeTextarea();
              this._commentsSection.enableCommentsSection();
              this._commentsSection.toggleRedErrorWrap(`add`);
            }
          });
        }
      }
    };

    this._commentsSection.onInputFocus(evt => {
      evt.preventDefault();
      document.addEventListener(`keydown`, onAddComment);
    });
  }
  blockForm() {
    this._commentsSection.disableCommentsSection();
    this._commentsSection.disableDeleteButtons();
  }
  enableForm() {
    this._commentsSection.enableCommentsSection();
    this._commentsSection.enableDeleteButtons();
  }
}
