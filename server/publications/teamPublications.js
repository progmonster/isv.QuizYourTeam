import { Meteor } from 'meteor/meteor';
import { Teams } from '../../model/collections';

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
