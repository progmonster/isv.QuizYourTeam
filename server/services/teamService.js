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

    Roles.addUsersToRoles(creator._id, TeamRoles.roleAdmin, `teams/${teamId}`);

    return teamId;
  },

  updateTeamSettings({ _id, title, description }, actor) {
    check(_id, String);
    check(title, String);
    check(description, String);
    check(actor, Object);
    check(Roles.userIsInRole(actor._id, TeamRoles.roleAdmin, `teams/${_id}`), true);

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
    check(Roles.userIsInRole(actor._id, TeamRoles.roleAdmin, `teams/${teamId}`), true);

    Teams.remove(teamId);
  },

  invitePersonByEmail(teamId, personEmail, actor) {
    check(teamId, String);
    check(personEmail, String);
    check(actor, Object);

    // todo error on invitation  yourself
    // todo error on invitation an user that is already a participant
    // todo progmonster validate email
    // todo progmonster check actor permissions

    let personUser = Accounts.findUserByEmail(personEmail);

    if (!personUser) {
      const createdUserId = Accounts.createUser({ email: personEmail });

      Accounts.sendEnrollmentEmail(createdUserId);

      personUser = Meteor.users.findOne(createdUserId);
    }

    const teamParticipant = TeamParticipant.createFromUser(personUser);

    teamParticipant.invitedAt = new Date();
    teamParticipant.state = INVITED;
    teamParticipant.role = TeamRoles.regularParticipant;

    Teams.update(teamId, { $push: { participants: teamParticipant } });
  },

  removeParticipant(teamId, participantId, actor) {
    check(teamId, String);
    check(participantId, String);
    check(actor, Object);

    Teams.update(teamId, { $pull: { participants: { _id: participantId } } });
    // todo progmonster update permissions
  },

  cancelInvitation(teamId, userId, actor) {
    check(teamId, String);
    check(userId, String);
    check(actor, Object);

    Teams.update(teamId, { $pull: { participants: { _id: userId } } });
  },

  resendInvitation(teamId, userId, actor) {
    check(teamId, String);
    check(userId, String);
    check(actor, Object);
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
};

export default teamService;
