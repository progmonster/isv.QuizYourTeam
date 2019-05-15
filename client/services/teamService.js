import { Meteor } from 'meteor/meteor';

const teamService = {
  create: teamSettings => Meteor.callAsync('teamMethods.createTeam', teamSettings),

  updateTeamSettings: teamSettings => Meteor
    .callAsync('teamMethods.updateTeamSettings', teamSettings),

  remove: teamId => Meteor.callAsync('teamMethods.removeTeam', teamId),

  invitePersonByEmailAsync: (teamId, personEmail) => Meteor
    .callAsync('teamMethods.invitePersonByEmailAsync', teamId, personEmail),
};

export default teamService;
