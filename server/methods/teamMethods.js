import { Meteor } from 'meteor/meteor';
import teamService from '../services/teamService';

Meteor.methods({
  'teamMethods.create': function ({ title, description }) {
    this.unblock();

    return teamService.create({
      title,
      description,
    }, Meteor.user());
  },

  'teamMethods.updateTeamSettings': function ({ _id, title, description }) {
    this.unblock();

    teamService.updateTeamSettings({
      _id,
      title,
      description,
    }, Meteor.user());
  },

  'teamMethods.remove': function (teamId) {
    this.unblock();

    teamService.remove(teamId, Meteor.user());
  },

  'teamMethods.invitePersonByEmail': function (teamId, personEmail) {
    this.unblock();

    teamService.invitePersonByEmail(teamId, personEmail, Meteor.user());
  },
});
