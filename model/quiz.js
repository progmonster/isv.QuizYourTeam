import QuizParagraph from './quizParagraph';
import QuizQuestion from './quizQuestion';
import TeamParticipant from './teamParticipant';
import QuizPassResult from './quizPassResult';

export default class Quiz {
  _id;

  title;

  descriptionEditorState;

  paragraphs;

  questions;

  creator;

  createdAt;

  updatedAt;

  teamId;

  passed;

  constructor(doc) {
    if (doc._id) {
      this._id = doc._id;
    }

    this.title = doc.title;
    this.descriptionEditorState = doc.descriptionEditorState;
    this.paragraphs = doc.paragraphs.map(paragraph => new QuizParagraph(paragraph));
    this.questions = doc.questions.map(question => new QuizQuestion(question));
    this.creator = new TeamParticipant(doc.creator);
    this.createdAt = doc.createdAt;
    this.updatedAt = doc.updatedAt;
    this.teamId = doc.teamId;
    this.passed = doc.passed.map(passResult => new QuizPassResult(passResult));
  }
}
