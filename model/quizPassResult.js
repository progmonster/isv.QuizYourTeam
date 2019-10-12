import TeamParticipant from './teamParticipant';

export default class QuizPassResult {
  user;

  result;

  maxPossibleResult;

  totalQuestionNumber;

  answeredCorrectlyQuestionNumber;

  passedAt;

  constructor(doc = {}) {
    this.user = new TeamParticipant(doc.user);
    this.result = doc.result;
    this.maxPossibleResult = doc.maxPossibleResult;
    this.totalQuestionNumber = doc.totalQuestionNumber;
    this.answeredCorrectlyQuestionNumber = doc.answeredCorrectlyQuestionNumber;
    this.passedAt = doc.passedAt;
  }

  static createForUser(
    user,
    result,
    maxPossibleResult,
    totalQuestionNumber,
    answeredCorrectlyQuestionNumber,
    passedAt,
  ) {
    return new QuizPassResult({
      user: TeamParticipant.createFromUser(user),
      result,
      maxPossibleResult,
      totalQuestionNumber,
      answeredCorrectlyQuestionNumber,
      passedAt,
    });
  }
}
