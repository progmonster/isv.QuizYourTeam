export default class QuizAnswer {
  title;

  checked;

  constructor(doc = {}) {
    this.title = doc.title;
    this.checked = doc.checked;
    this.checkedByUser = doc.checkedByUser; // todo progmonster get rid of it from the model
  }
}
