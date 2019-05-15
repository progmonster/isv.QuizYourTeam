import { Meteor } from 'meteor/meteor';

const teamService = {
  create: teamSettings => Meteor.callAsync('teamMethods.create', teamSettings),

  updateTeamSettings: teamSettings => Meteor
    .callAsync('teamMethods.updateTeamSettings', teamSettings),

  remove: teamId => Meteor.callAsync('teamMethods.remove', teamId),

  invitePersonByEmail: (teamId, personEmail) => Meteor
    .callAsync('teamMethods.invitePersonByEmail', teamId, personEmail),
};

export default teamService;
