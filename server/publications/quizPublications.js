import { Meteor } from 'meteor/meteor';
import { Quizzes } from '../../model/collections';

Meteor.publish('quizzes', function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() => {
    const grantedQuizzes = Roles.getGroupsForUser(this.userId, 'viewQuiz')
      .map(grantedGroup => grantedGroup.replace(/^quizzes\//, ''));

    return Quizzes.find({ _id: { $in: grantedQuizzes } });
  });
});

Meteor.publish('quiz', function (quizId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions

    Quizzes.find(quizId));
});
