import { check } from 'meteor/check';
import { Quizzes } from '../../model/collections';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

const quizService = {
  update(quiz, actorId) {
    check(quiz._id, String);
    check(actorId, String);
    check(Roles.userIsInRole(actorId, 'editQuiz', `quizzes/${quiz._id}`), true);

    Quizzes.update(quiz._id, quiz);
  },

  insert(quiz, creatorId) {
    check(quiz._id, undefined);
    check(creatorId, String);

    const quizId = Quizzes.insert(quiz);

    Roles.addUsersToRoles(
      creatorId,
      ['viewQuiz', 'editQuiz', 'removeQuiz', 'passQuiz'],
      `quizzes/${quizId}`,
    );

    return quizId;
  },

  remove(quizId, actorId) {
    check(quizId, String);
    check(actorId, String);
    check(Roles.userIsInRole(actorId, 'removeQuiz', `quizzes/${quizId}`), true);

    Quizzes.remove(quizId);

    Meteor.users.update(
      {},
      { $unset: { [`roles.quizzes/${quizId}`]: '' } },
      { multi: true },
    );
  },
};

export default quizService;
