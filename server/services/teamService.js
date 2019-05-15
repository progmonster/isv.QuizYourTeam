import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Teams } from '../../model/collections';
import TeamCreator from '../../model/teamCreator';
import TeamParticipant from '../../model/teamParticipant';
import { ACTIVE, INVITED } from '../../model/participantStates';
import Team from '../../model/team';
import { Roles } from 'meteor/alanning:roles';

const teamService = {
  create({ title, description }, creator) {
    check(title, String);
    check(description, String);
    check(creator, Object);

    const creatorAsParticipant = TeamParticipant.createFromUser(creator);

    const createdAt = new Date();

    creatorAsParticipant.joinedAt = createdAt;
    creatorAsParticipant.state = ACTIVE;

    const team = new Team({
      title,
      description,
      createdAt,
      updatedAt: createdAt,
      creator: TeamCreator.createFromUser(creator),
      participants: [creatorAsParticipant],
    });

    return Teams.insert(team);
  },

  updateTeamSettings({ _id, title, description }, actor) {
    check(_id, String);
    check(title, String);
    check(description, String);
    check(actor, Object);

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

    Teams.update(teamId, { $push: { participants: teamParticipant } });
  },
};

export default teamService;
