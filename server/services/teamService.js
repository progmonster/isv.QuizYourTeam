import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Teams } from '../../model/collections';
import TeamCreator from '../../model/teamCreator';
import TeamParticipant from '../../model/teamParticipant';
import { ACTIVE, INVITED } from '../../model/participantStates';
import Team from '../../model/team';

const teamService = {
  createTeam({ title, description }, creator) {
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

  invitePersonByEmail(teamId, personEmail, actor) {
    check(teamId, String);
    check(personEmail, String);
    check(actor, Object);

    // todo error on invitation  yourself
    // todo error on invitation an user that is already a participant
    // todo progmonster validate email

    // todo if the user was not registered then create and send email with confirmation
    // add to the email info about adding invitation to team after registration confirmation
    // set password

    // todo if the user already signed then add the invite to user model and send the email

    // todo add the participant to the team.

    let personUser = Accounts.findUserByEmail(personEmail);

    if (!personUser) {
      const createdUserId = Accounts.createUser({ email: personEmail });

      Accounts.sendEnrollmentEmail(createdUserId);

      personUser = Accounts.findUserByEmail(personEmail);
    }

    const teamParticipant = TeamParticipant.createFromUser(personUser);

    teamParticipant.invitedAt = new Date();
    teamParticipant.state = INVITED;

    Teams.update(teamId, { $push: { participants: teamParticipant } });
  },
};

export default teamService;
