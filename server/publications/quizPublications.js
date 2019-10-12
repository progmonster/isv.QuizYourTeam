import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Quizzes } from '../../model/collections';
import { QuizRoles } from '../../model/roles';

Meteor.publish('quizzes', function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() => {
    const grantedQuizzes = Roles.getQuizzesForUserWithRoles(this.userId, QuizRoles.viewQuiz);

    return Quizzes.find({ _id: { $in: grantedQuizzes } });
  });
});

Meteor.publish('quiz', function (quizId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() => {
    if (Roles.hasUserQuizRoles(this.userId, QuizRoles.viewQuiz, quizId)) {
      return Quizzes.find(quizId);
    }

    return [];
  });
});
