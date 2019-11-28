import { CommentsSection } from "../components/commentsComponent";
import { render, unrender } from "../utils";
import { UPDATE_TYPE, POSITION, DELETE_BUTTON_NAME, EXIT_KEY } from "../consts";

const emojis = {
  "emoji-smile": `smile`,
  "emoji-sleeping": `sleeping`,
  "emoji-gpuke": `puke`
};
const getEmojiUrl = id => `./images/emoji/${emojis[id]}.png`;

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
      POSITION.BEFOREEND
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
    this._commentsSection.addCallbackOnEachDeleteBtnClick(index => {
      this._commentsSection.changeHeadingOnBtnClick(
        DELETE_BUTTON_NAME.DELETING,
        index
      );
      this._comments = [
        ...this._comments.slice(0, index),
        ...this._comments.slice(index + 1)
      ];
      this._render();
      this._onCommentsChange(this._comments, {
        updateType: UPDATE_TYPE.DELETE_COMMENT,
        onSuccess: () => {
          this._rerender(this._comments);
        },
        onError: () => {
          this._commentsSection.changeHeadingOnBtnClick(
            DELETE_BUTTON_NAME.DELETE,
            index
          );
        }
      });
    });

    this._render();

    this._commentsSection.addCallbackForEachEmojiOption(evt => {
      evt.preventDefault();
      const emojiId = evt.target.id;

      this._currentEmoji = emojis[emojiId];
      this._commentsSection.updateSelectedEmojiUrl(getEmojiUrl(emojiId));
    });

    const onAddComment = evt => {
      if (
        (evt.ctrlKey && evt.keyCode === EXIT_KEY) ||
        (evt.keyCode === EXIT_KEY && evt.metaKey)
      ) {
        this._commentsSection.toggleRedErrorWrap(`remove`);

        const formData = new FormData(this._popup.getFormElement());

        const newComment = {
          emotion: this._currentEmoji || `smile`,
          comment: formData.get(`comment`),
          author: ``,
          date: new Date().toISOString().slice(0, 10)
        };

        this._commentsSection.disableCommentsSection();
        this._comments = [...this._comments, newComment];
        this._onCommentsChange(this._comments, {
          updateType: UPDATE_TYPE.CREATE_COMMENT,
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
    };

    this._commentsSection.addCallbackOnTextInputFocus(evt => {
      evt.preventDefault();
      document.addEventListener(`keydown`, onAddComment);
    });
  }
}
