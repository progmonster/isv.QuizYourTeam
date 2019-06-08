import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Teams } from '../../model/collections';
import TeamCreator from '../../model/teamCreator';
import TeamParticipant from '../../model/teamParticipant';
import { ACTIVE, INVITED } from '../../model/participantStates';
import Team from '../../model/team';
import { QuizRoles, TeamRoles } from '../../model/roles';
import { getUserEmail } from '../../users/userUtils';

const teamService = {
  create({ title, description }, creator) {
    check(title, String);
    check(description, String);
    check(creator, Object);

    const creatorAsParticipant = TeamParticipant.createFromUser(creator);

    const createdAt = new Date();

    creatorAsParticipant.joinedAt = createdAt;
    creatorAsParticipant.state = ACTIVE;
    creatorAsParticipant.role = TeamRoles.adminRole;

    const team = new Team({
      title,
      description,
      createdAt,
      updatedAt: createdAt,
      creator: TeamCreator.createFromUser(creator),
      participants: [creatorAsParticipant],
    });

    const teamId = Teams.insert(team);

    Roles.addTeamAdminRoleForUser(creator._id, teamId);

    return teamId;
  },

  updateTeamSettings({ _id, title, description }, actor) {
    check(_id, String);
    check(title, String);
    check(description, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, _id), true);

    return Teams.updateTeamSettings({
      _id,
      title,
      description,
      updatedAt: new Date(),
    });
  },

  remove(teamId, actor) {
    check(teamId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);

    Teams.remove(teamId);

    Roles.removeTeamRolesForAllUsers(teamId);
  },

  invitePersonByEmail(teamId, personEmail, actor) {
    // todo progmonster todo do not allow to invite the same person more than 1 per 24 hours
    // show note in UI

    check(teamId, String);
    check(personEmail, String);

    // todo improve error messages (especially for errors displayed for user)
    check(/^.+@.+\..+$/.test(personEmail.trim()), true);

    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);

    let personUser = Accounts.findUserByEmail(personEmail.trim());

    if (!personUser) {
      const createdUserId = Accounts.createUser({ email: personEmail.trim() });

      Accounts.sendEnrollmentEmail(createdUserId);

      personUser = Meteor.users.findOne(createdUserId);
    }

    if (Teams.isUserInTeam(teamId, personUser._id)) {
      throw new Meteor.Error('The invitation was already made');
    }

    const teamParticipant = TeamParticipant.createFromUser(personUser);

    teamParticipant.invitedAt = new Date();
    teamParticipant.state = INVITED;
    teamParticipant.role = TeamRoles.regularParticipantRole;

    const updated = Teams.addParticipant(teamId, teamParticipant);

    if (!updated) {
      throw new Meteor.Error('Error adding invited user to the team');
    }

    Roles.addRegularTeamParticipantRoleForUser(teamParticipant._id, teamId);
  },

  removeParticipant(teamId, participantId, actor) {
    check(teamId, String);
    check(participantId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);
    check(actor._id === participantId, false);

    const updated = Teams.removeParticipant(teamId, participantId);

    if (!updated) {
      throw new Meteor.Error('Error participant removal');
    }

    Roles.removeTeamQuizRolesForUser(participantId, teamId);

    // todo progmonster  remove quizzes results for user
  },

  cancelInvitation(teamId, userId, actor) {
    check(teamId, String);
    check(userId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);

    const updated = Teams.removeParticipant(teamId, userId);

    if (!updated) {
      throw new Meteor.Error('Error cancelling the invitation');
    }

    Roles.removeTeamRolesForUser(userId, teamId);
    Roles.removeTeamQuizRolesForUser(userId, teamId);
  },

  resendInvitation(teamId, userId, actor) {
    // todo progmonster todo do not allow to invite the same person more than 1 per 24 hours
    // consider that you could delete and recreate the invitation.
    // show note in UI

    check(teamId, String);
    check(userId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);

    const personUser = Meteor.users.findOne(userId);

    if (!personUser) {
      throw new Meteor.Error('The user is not found');
    }

    Email.send({
      from: Accounts.emailTemplates.from,
      to: getUserEmail(personUser),
      text: 'You are invited to a new team. Please check your dashboard.',
    });
  },

  acceptInvitation(teamId, user) {
    check(teamId, String);
    check(user, Object);

    const updated = Teams.updateParticipantState(teamId, user._id, INVITED, ACTIVE);

    if (!updated) {
      throw new Meteor.Error('Error accepting the invitation');
    }

    const userRole = Teams.findOne(teamId)
      .getParticipantRole(user._id);

    // todo remove duplication with quizService.insert
    if (userRole === TeamRoles.adminRole) {
      Roles.addTeamQuizRolesForUser(
        user,
        [QuizRoles.viewQuiz, QuizRoles.passQuiz],
        teamId,
      );
    } else if (userRole === TeamRoles.regularParticipantRole) {
      Roles.addTeamQuizRolesForUser(
        user,
        [QuizRoles.viewQuiz, QuizRoles.passQuiz, QuizRoles.editQuiz, QuizRoles.removeQuiz],
        teamId,
      );
    }
  },

  rejectInvitation(teamId, user) {
    check(teamId, String);
    check(user, Object);

    const updated = Teams.removeParticipantWithState(teamId, user._id, INVITED);

    if (!updated) {
      throw new Meteor.Error('Error rejecting the invitation');
    }

    Roles.removeTeamRolesForUser(user._id, teamId);
    Roles.removeTeamQuizRolesForUser(user._id, teamId);
  },
};

export default teamService;
