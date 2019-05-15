import { Meteor } from 'meteor/meteor';
import quizService from '../services/quizService';

Meteor.methods({
  'quizMethods.update': function (quiz) {
    this.unblock();

    quizService.update(quiz, this.userId);
  },

  'quizMethods.insert': function (quiz) {
    this.unblock();

    return quizService.insert(quiz, this.userId);
  },

  'quizMethods.remove': function (quizId) {
    this.unblock();

    quizService.remove(quizId, this.userId);
  },
});
