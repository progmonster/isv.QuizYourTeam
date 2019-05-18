import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Teams } from '../../model/collections';
import TeamCreator from '../../model/teamCreator';
import TeamParticipant from '../../model/teamParticipant';
import { ACTIVE, INVITED } from '../../model/participantStates';
import Team from '../../model/team';
import { TeamRoles } from '../../model/roles';

const teamService = {
  create({ title, description }, creator) {
    check(title, String);
    check(description, String);
    check(creator, Object);

    const creatorAsParticipant = TeamParticipant.createFromUser(creator);

    const createdAt = new Date();

    creatorAsParticipant.joinedAt = createdAt;
    creatorAsParticipant.state = ACTIVE;
    creatorAsParticipant.role = TeamRoles.roleAdmin;

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

    Teams.update(_id, {
      $set: {
        title,
        description,
        updatedAt: new Date(),
      },
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

    if (teamService.isUserInTeam(teamId, personUser._id)) {
      throw new Meteor.Error('The invitation was already made');
    }

    const teamParticipant = TeamParticipant.createFromUser(personUser);

    teamParticipant.invitedAt = new Date();
    teamParticipant.state = INVITED;
    teamParticipant.role = TeamRoles.regularParticipantRole;

    const updated = Teams.update({
      _id: teamId,
      participants: { $not: { $elemMatch: { _id: personUser._id } } },
    }, { $push: { participants: teamParticipant } });

    if (!updated) {
      throw new Meteor.Error('Error adding invited user to the team');
    }
  },

  removeParticipant(teamId, participantId, actor) {
    check(teamId, String);
    check(participantId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);
    check(actor._id === participantId, false);

    Teams.update(teamId, { $pull: { participants: { _id: participantId } } });
    // todo progmonster update permissions
  },

  cancelInvitation(teamId, userId, actor) {
    check(teamId, String);
    check(userId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);

    Teams.update(teamId, { $pull: { participants: { _id: userId } } });
  },

  resendInvitation(teamId, userId, actor) {
    // todo progmonster todo do not allow to invite the same person more than 1 per 24 hours
    // consider that you could delete and recreate the invitation.
    // show note in UI

    check(teamId, String);
    check(userId, String);
    check(actor, Object);
    check(Roles.isTeamAdmin(actor._id, teamId), true);
    // todo progmonster if user doesn't exist then create acc and send invitation
    // todo progmonster if user exists then send regular email with notification about invitation to team
  },

  acceptInvitation(teamId, user) {
    check(teamId, String);
    check(user, Object);

    Teams.update({
      _id: teamId,

      participants: {
        $elemMatch: {
          _id: user._id,
          state: INVITED,
        },
      },
    }, { $set: { 'participants.$.state': ACTIVE } });

    // todo progmonster add privileges
  },

  rejectInvitation(teamId, user) {
    check(teamId, String);
    check(user, Object);

    Teams.update({
      _id: teamId,

      participants: {
        $elemMatch: {
          _id: user._id,
          state: INVITED,
        },
      },
    }, { $pull: { participants: { _id: user._id } } });
  },

  isUserInTeam(teamId, userId) {
    return Teams
      .find({
        _id: teamId,
        'participants._id': userId,
      }, { limit: 1 })
      .count(false) > 0;
  },
};

export default teamService;
