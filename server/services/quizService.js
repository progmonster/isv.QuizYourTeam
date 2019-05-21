import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Quizzes, Teams } from '../../model/collections';
import { getUserEmail, getUserFullName } from '../../users/userUtils';
import { QuizRoles } from '../../model/roles';

const quizService = {
  insert(quiz, creatorId) {
    check(quiz._id, undefined);
    check(quiz.teamId, String);
    check(creatorId, String);
    check(Teams.isUserInTeam(quiz.teamId, creatorId), true);

    const createdAt = new Date();

    const creator = Meteor.user();

    const quizId = Quizzes.insert({
      ...quiz,
      creator: {
        _id: creatorId,
        email: getUserEmail(creator),
        fullName: getUserFullName(creator),
      },
      createdAt,
      updatedAt: createdAt,
    });

    const team = Teams.findOne(quiz.teamId);

    Roles.addQuizRolesForUsers(
      team.participants,
      [QuizRoles.viewQuiz, QuizRoles.passQuiz],
      quizId,
    );

    Roles.addQuizRolesForUsers(
      [...team.getAdmins(), creatorId],
      [QuizRoles.editQuiz, QuizRoles.removeQuiz],
      quizId,
    );

    return quizId;
  },

  update(quiz, actorId) {
    check(quiz._id, String);
    check(quiz.teamId, undefined);
    check(actorId, String);
    // todo progmonster move such instructions to Roles
    check(Roles.userIsInRole(actorId, 'editQuiz', `quizzes/${quiz._id}`), true);

    console.log(JSON.stringify(quiz));
    // todo progmonster update only certain fields
   // Quizzes.update(quiz._id, quiz);
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
