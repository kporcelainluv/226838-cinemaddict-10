import DOMPurify from "dompurify";

export class ModelComment {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = DOMPurify.sanitize(comment[`author`]);
    this.emotion = DOMPurify.sanitize(comment[`emotion`]);
    this.comment = DOMPurify.sanitize(comment[`comment`]);
    this.date = comment[`date`];
  }

  static parseComment(comment) {
    return new ModelComment(comment);
  }

  static parseComments(comment) {
    return comment.map(ModelComment.parseComment);
  }
  static toRAW(comment) {
    return {
      id: comment.id,
      author: comment.author,
      comment: comment.comment,
      date: comment.date,
      emotion: comment.emotion
    };
  }
}
