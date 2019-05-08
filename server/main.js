import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";

import { Quizzes } from "../imports/collections"

Meteor.publish("quizzes", function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() => {
    const grantedQuizzes = Roles.getGroupsForUser(this.userId, "viewQuiz")
      .map(grantedGroup => grantedGroup.replace(/^quizzes\//, ""));

    return Quizzes.find({ _id: { $in: grantedQuizzes } });
  });
});

Meteor.publish("quiz", function (quizId) {
  if (!this.userId) {
    return [];
  }

  return Quizzes.find(quizId);
});

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl("verify-email?token=" + token)
};

Accounts.emailTemplates.from = "akatorgin@yandex.ru";// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});

Meteor.methods({
  "quizzes.update"(quiz) {
    check(this.userId, String);
    check(quiz._id, String);
    check(Roles.userIsInRole(this.userId, "editQuiz", "quizzes/" + quiz._id), true);

    Quizzes.update(quiz._id, quiz);
  },

  "quizzes.insert"(quiz) {
    check(this.userId, String);
    check(quiz._id, undefined);

    const quizId = Quizzes.insert(quiz);

    Roles.addUsersToRoles(this.userId, ["viewQuiz"], "quizzes/" + quizId);
    Roles.addUsersToRoles(this.userId, ["editQuiz"], "quizzes/" + quizId);
    Roles.addUsersToRoles(this.userId, ["removeQuiz"], "quizzes/" + quizId);
    Roles.addUsersToRoles(this.userId, ["passQuiz"], "quizzes/" + quizId);

    return quizId;
  },

  "quizzes.remove"(quizId) {
    check(this.userId, String);
    check(quizId, String);
    check(Roles.userIsInRole(this.userId, "removeQuiz", "quizzes/" + quizId), true);

    Quizzes.remove(quizId);

    Meteor.users.update({}, { $unset: { [`roles.quizzes/${quizId}`]: "" } }, { multi: true })
  }
});

Meteor.startup(() => {
  // code to run on server at startup
});


