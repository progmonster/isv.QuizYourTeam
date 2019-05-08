import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from "meteor/accounts-base";
import { Email } from "meteor/email";

import { Quizzes } from "../imports/collections"

Meteor.publish("quizzes", () => {
  return Quizzes.find();
});

Meteor.publish("quiz", (quizId) => {
  return Quizzes.find(quizId);
});

Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl("verify-email?token=" + token)
};

Accounts.emailTemplates.from = "akatorgin@yandex.ru";// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});


Meteor.methods({
  "quizzes.update"(quiz) {
    check(quiz._id, String);

    Quizzes.update(quiz._id, quiz);
  },

  "quizzes.insert"(quiz) {
    check(quiz._id, undefined);

    return Quizzes.insert(quiz);
  },

  "quizzes.remove"(quizId) {
    check(quizId, String);

    Quizzes.remove(quizId);
  }
});


Meteor.startup(() => {
  // code to run on server at startup
});


