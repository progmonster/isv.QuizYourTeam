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

  'teamMethods.removeParticipant': function (teamId, participantId) {
    this.unblock();

    teamService.removeParticipant(teamId, participantId, Meteor.user());
  },

  'teamMethods.cancelInvitation': function (teamId, userId) {
    this.unblock();

    teamService.cancelInvitation(teamId, userId, Meteor.user());
  },

  'teamMethods.resendInvitation': function (teamId, userId) {
    this.unblock();

    teamService.resendInvitation(teamId, userId, Meteor.user());
  },
});
