import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import '../model/collections';
import { Quizzes, Teams } from '../model/collections';
import { getUserFullName } from '../users/userUtils';
import { ACTIVE } from '../model/participantStates';

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

Accounts.emailTemplates.from = 'akatorgin@yandex.ru';// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});

Meteor.methods({
  'quizzes.update': function (quiz) {
    check(this.userId, String);
    check(quiz._id, String);
    check(Roles.userIsInRole(this.userId, 'editQuiz', `quizzes/${quiz._id}`), true);

    Quizzes.update(quiz._id, quiz);
  },

  'quizzes.insert': function (quiz) {
    check(this.userId, String);
    check(quiz._id, undefined);

    const quizId = Quizzes.insert(quiz);

    Roles.addUsersToRoles(this.userId, ['viewQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['editQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['removeQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['passQuiz'], `quizzes/${quizId}`);

    return quizId;
  },

  'quizzes.remove': function (quizId) {
    check(this.userId, String);
    check(quizId, String);
    check(Roles.userIsInRole(this.userId, 'removeQuiz', `quizzes/${quizId}`), true);

    Quizzes.remove(quizId);

    Meteor.users.update({}, { $unset: { [`roles.quizzes/${quizId}`]: '' } }, { multi: true });
  },

  'teams.createTeam': function ({ title, description }) {
    check(this.userId, String);
    check(title, String);
    check(description, String);

    const creator = Meteor.user();

    const creatorEmail = creator.emails[0].address;

    const creatorFullName = getUserFullName(creator);

    const createdAt = new Date();

    const teamId = Teams.insert({
      title,
      description,
      createdAt,
      updatedAt: createdAt,
      creator: {
        userId: this.userId,
        email: creatorEmail,
        fullName: creatorFullName,
      },

      participants: {
        [this.userId]: {
          userId: this.userId,
          joinedAt: createdAt,
          email: creatorEmail,
          fullName: creatorFullName,
          state: ACTIVE,
        },
      },
    });

    return teamId;
  },

  'teams.updateTeamSettings': function ({ _id, title, description }) {
    check(this.userId, String);
    check(_id, String);
    check(title, String);
    check(description, String);

    Teams.update(_id, {
      $set: {
        title,
        description,
        updatedAt: new Date(),
      },
    });
  },

  'teams.removeTeam': function (teamId) {
    check(this.userId, String);
    check(teamId, String);

    Teams.remove(teamId);
  },

  'teams.inviteNewUserAsync': function (teamId, newUserEmail) {
    check(this.userId, String);
    check(teamId, String);
    check(newUserEmail, String);

    // todo error on invitation  yourself
    // todo progmonster validate email

    // todo if the user was not registered then create and send email with confirmation
    // add to the email info about adding invitation to team after registration confirmation
    // set password

    // todo if the user already signed then add the invite to user model and send the email

    // todo add the participant to the team.
  },

});

Meteor.startup(() => {
  // code to run on server at startup
});
