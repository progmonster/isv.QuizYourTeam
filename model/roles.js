import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

export const TeamRoles = {
  adminRole: 'adminRole',
  regularParticipantRole: 'regularParticipantRole',
};

export const QuizRoles = {};

Roles.isTeamAdmin = (userId, teamId) => Roles
  .userIsInRole(userId, TeamRoles.adminRole, `teams/${teamId}`);

Roles.addTeamAdminRoleForUser = (userId, teamId) => Roles
  .addUsersToRoles(userId, TeamRoles.adminRole, `teams/${teamId}`);

Roles.addRegularTeamParticipantRoleForUser = (userId, teamId) => Roles
  .addUsersToRoles(userId, TeamRoles.regularParticipantRole, `teams/${teamId}`);

Roles.removeTeamRolesForAllUsers = (teamId) => {
  Meteor.users.update(
    {},
    { $unset: { [`roles.teams/${teamId}`]: '' } },
    { multi: true },
  );
};

Roles.removeTeamRolesForUser = (userId, teamId) => {
  Meteor.users.update(
    userId,
    { $unset: { [`roles.teams/${teamId}`]: '' } },
  );
};
