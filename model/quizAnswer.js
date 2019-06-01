export default class QuizAnswer {
  title;

  checked;

  constructor(doc) {
    this.title = doc.title;
    this.checked = doc.checked;
  }
}
