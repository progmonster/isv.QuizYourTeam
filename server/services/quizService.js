import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Quizzes, Teams } from '../../model/collections';
import { QuizRoles } from '../../model/roles';
import Quiz from '../../model/quiz';
import QuizCreator from '../../model/quizCreator';

const quizService = {
  insert(quiz, creator) {
    check(quiz._id, undefined);
    check(quiz.teamId, String);
    check(creator, Object);
    check(Teams.isUserInTeam(quiz.teamId, creator._id), true);

    const createdAt = new Date();

    const sanitizedQuiz = new Quiz({
      title: quiz.title,
      descriptionEditorState: quiz.descriptionEditorState,
      paragraphs: quiz.paragraphs || [],
      questions: quiz.questions || [], // todo validate question with answers
      creator: new QuizCreator(creator),
      createdAt,
      updatedAt: createdAt,
      teamId: quiz.teamId,
      passed: [],
    });

    console.log(JSON.stringify(quiz, null, 2));
    console.log(JSON.stringify(sanitizedQuiz, null, 2));

    const quizId = Quizzes.insert(sanitizedQuiz);

    const team = Teams.findOne(quiz.teamId);

    Roles.addQuizRolesForUsers(
      team.participants,
      [QuizRoles.viewQuiz, QuizRoles.passQuiz],
      quizId,
    );

    Roles.addQuizRolesForUsers(
      [...team.getAdmins(), creator._id],
      [QuizRoles.editQuiz, QuizRoles.removeQuiz],
      quizId,
    );

    return quizId;
  },

  update(quiz, actorId) {
    check(quiz._id, String);
    check(actorId, String);
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.editQuiz, quiz._id), true);

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
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.removeQuiz, quizId), true);

    Quizzes.remove(quizId);

    Roles.removeQuizRolesForAllUsers(quizId);
  },
};

export default quizService;
