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

    // todo progmonster copy only known quiz fields from a client
    const quizId = Quizzes.insert({
      title: quiz.title,
      descriptionEditorState: quiz.descriptionEditorState,
      paragraphs: quiz.paragraphs,
      questions: quiz.questions,

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
    check(actorId, String);
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.editQuiz, quiz._id, true));

    // todo progmonster copy only known quiz fields from a client
    Quizzes.update(quiz._id, {
      $set: {
        title: quiz.title,
        updatedAt: new Date(),
        descriptionEditorState: quiz.descriptionEditorState,
        paragraphs: quiz.paragraphs,
        questions: quiz.questions,
      },
    });
  },

  remove(quizId, actorId) {
    check(quizId, String);
    check(actorId, String);
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.removeQuiz, quizId, true));

    Quizzes.remove(quizId);

    Roles.removeQuizRolesForAllUsers(quizId);
  },
};

export default quizService;
