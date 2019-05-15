import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Quizzes, Teams } from '../model/collections';
import teamService from './services/teamService';

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

Meteor.publish('teams', function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions
    /*
          const grantedQuizzes = Roles.getGroupsForUser(this.userId, "viewQuiz")
            .map(grantedGroup => grantedGroup.replace(/^quizzes\//, ""));
      */

    Teams.find({}));
});

Meteor.publish('team', function (teamId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions

    Teams.find(teamId));
});

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl(`verify-email?token=${token}`);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl(`set-initial-password?token=${token}`);
};

Accounts.emailTemplates.from = 'akatorgin@yandex.ru';// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});

Meteor.methods({
  // todo move to quizService
  'quizMethods.update': function (quiz) {
    check(this.userId, String);
    check(quiz._id, String);
    check(Roles.userIsInRole(this.userId, 'editQuiz', `quizzes/${quiz._id}`), true);

    this.unblock();

    Quizzes.update(quiz._id, quiz);
  },

  // todo move to quizService
  'quizMethods.insert': function (quiz) {
    check(this.userId, String);
    check(quiz._id, undefined);

    this.unblock();

    const quizId = Quizzes.insert(quiz);

    Roles.addUsersToRoles(this.userId, ['viewQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['editQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['removeQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['passQuiz'], `quizzes/${quizId}`);

    return quizId;
  },

  // todo move to quizService
  'quizMethods.remove': function (quizId) {
    check(this.userId, String);
    check(quizId, String);
    check(Roles.userIsInRole(this.userId, 'removeQuiz', `quizzes/${quizId}`), true);

    this.unblock();

    Quizzes.remove(quizId);

    Meteor.users.update({}, { $unset: { [`roles.quizzes/${quizId}`]: '' } }, { multi: true });
  },

  'teamMethods.createTeam': function ({ title, description }) {
    this.unblock();

    return teamService.createTeam({
      title,
      description,
    }, Meteor.user());
  },

  // todo move to teamService
  'teamMethods.updateTeamSettings': function ({ _id, title, description }) {
    check(this.userId, String);
    check(_id, String);
    check(title, String);
    check(description, String);

    this.unblock();

    Teams.update(_id, {
      $set: {
        title,
        description,
        updatedAt: new Date(),
      },
    });
  },

  // todo move to teamService
  'teamMethods.removeTeam': function (teamId) {
    check(this.userId, String);
    check(teamId, String);

    Teams.remove(teamId);
  },

  'teamMethods.invitePersonByEmailAsync': function (teamId, personEmail) {
    this.unblock();

    teamService.invitePersonByEmail(teamId, personEmail, Meteor.user());
  },
});

Meteor.startup(() => {
  // code to run on server at startup
});
