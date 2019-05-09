import { Meteor } from 'meteor/meteor';
import { promisify } from 'util';

Meteor.callAsync = promisify(Meteor.call);

export default {
  quizzes: {
    updateAsync: quiz => Meteor.callAsync('quizzes.update', quiz),

    insertAsync: quiz => Meteor.callAsync('quizzes.insert', quiz),

    removeAsync: quizId => Meteor.callAsync('quizzes.remove', quizId),
  },

  teams: {
    createTeamAsync: teamSettings => Meteor.callAsync('teams.createTeam', teamSettings),

    updateTeamSettingsAsync: teamSettings => Meteor.callAsync('teams.updateTeamSettings', teamSettings),

    removeTeamAsync: teamId => Meteor.callAsync('teams.removeTeam', teamId),

  },
};
