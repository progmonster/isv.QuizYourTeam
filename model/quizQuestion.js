import QuizAnswer from './quizAnswer';

export default class QuizQuestion {
  editorState;

  answerType;

  answers;

  constructor(doc) {
    this.editorState = doc.editorState;
    this.answerType = doc.answerType;
    this.answers = doc.answers.map(answer => new QuizAnswer(answer));
  }
}
