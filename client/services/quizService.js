import { Meteor } from 'meteor/meteor';

const quizService = {
  update: quiz => Meteor.callAsync('quizMethods.update', quiz),

  insert: quiz => Meteor.callAsync('quizMethods.insert', quiz),

  remove: quizId => Meteor.callAsync('quizMethods.remove', quizId),

  sendAnswers: (quizId, quizUpdatedAt, answers) => Meteor.callAsync(
    'quizMethods.sendAnswers',
    quizId,
    quizUpdatedAt,
    answers,
  ),
};

export default quizService;
