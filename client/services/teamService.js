import { Meteor } from 'meteor/meteor';

const teamService = {
  create: teamSettings => Meteor.callAsync('teamMethods.create', teamSettings),

  updateTeamSettings: teamSettings => Meteor
    .callAsync('teamMethods.updateTeamSettings', teamSettings),

  remove: teamId => Meteor.callAsync('teamMethods.remove', teamId),

  invitePersonByEmail: (teamId, personEmail) => Meteor
    .callAsync('teamMethods.invitePersonByEmail', teamId, personEmail),

  removeParticipant: (teamId, participantId) => Meteor
    .callAsync('teamMethods.removeParticipant', teamId, participantId),

  cancelInvitation: (teamId, userId) => Meteor
    .callAsync('teamMethods.cancelInvitation', teamId, userId),

  resendInvitation: (teamId, userId) => Meteor
    .callAsync('teamMethods.resendInvitation', teamId, userId),
};

export default teamService;
