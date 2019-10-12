import size from 'lodash/size';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Quizzes } from './collections';

export const TeamRoles = {
  adminRole: 'adminRole', // todo rename to admin
  regularParticipantRole: 'regularParticipantRole', // todo rename to regularParticipant
};

export const QuizRoles = {
  viewQuiz: 'viewQuiz',
  editQuiz: 'editQuiz',
  removeQuiz: 'removeQuiz',
  passQuiz: 'passQuiz',
};

// todo progmonster extract these methods to RoleService.

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

Roles.addQuizRolesForUsers = (users, roles, quizId) => Roles.addUsersToRoles(
  users,
  roles,
  `quizzes/${quizId}`,
);

Roles.addTeamQuizRolesForUser = (user, roles, teamId) => {
  const quizzes = Quizzes.find({ teamId }, { fields: { _id: 1 } });

  quizzes.forEach(({ _id: quizId }) => Roles.addQuizRolesForUsers(user, roles, quizId));
};

Roles.removeTeamQuizRolesForUser = (userId, teamId) => {
  const unsetTeamQuizRoles = Quizzes
    .find({ teamId }, { fields: { _id: 1 } })
    .map(({ _id }) => _id)
    .reduce((unsets, quizId) => ({
      ...unsets,
      [`roles.quizzes/${quizId}`]: '',
    }), {});

  if (size(unsetTeamQuizRoles)) {
    Meteor.users.update(
      userId,
      { $unset: unsetTeamQuizRoles },
    );
  }
};

Roles.hasUserQuizRoles = (user, roles, quizId) => Roles
  .userIsInRole(user, roles, `quizzes/${quizId}`);

Roles.removeQuizRolesForAllUsers = (quizId) => {
  Meteor.users.update(
    {},
    { $unset: { [`roles.quizzes/${quizId}`]: '' } },
    { multi: true },
  );
};

Roles.getQuizzesForUserWithRoles = (user, roles) => Roles
  .getGroupsForUser(user, roles)
  .map(roleGroup => roleGroup.replace(/^quizzes\//, ''));
