import { Mongo } from 'meteor/mongo';
import Team from './team';
import { ACTIVE, INVITED } from './participantStates';

export const Quizzes = new Mongo.Collection('quizzes');

export const Teams = new Mongo.Collection('teams', {
  transform: doc => new Team(doc),
});

Teams.updateTeamSettings = ({
                              _id,
                              title,
                              description,
                              updatedAt,
                            }) => Teams.update(_id, {
  $set: {
    title,
    description,
    updatedAt,
  },
});

Teams.addParticipant = (teamId, participant) => Teams
  .update({
    _id: teamId,
    participants: { $not: { $elemMatch: { _id: participant._id } } },
  }, { $push: { participants: participant } });

Teams.removeParticipant = (teamId, participantId) => Teams
  .update(teamId, { $pull: { participants: { _id: participantId } } });

Teams.removeParticipantWithState = (teamId, participantId, participantStateToCheck) => Teams
  .update({
    _id: teamId,

    participants: {
      $elemMatch: {
        _id: participantId,
        state: participantStateToCheck,
      },
    },
  }, { $pull: { participants: { _id: participantId } } });

Teams.updateParticipantState = (teamId, participantId, oldStateToCheck, newState) => Teams
  .update({
    _id: teamId,

    participants: {
      $elemMatch: {
        _id: participantId,
        state: oldStateToCheck,
      },
    },
  }, { $set: { 'participants.$.state': newState } });

Teams.isUserInTeam = (teamId, userId) => Teams
  .find({
    _id: teamId,
    'participants._id': userId,
  }, { limit: 1 })
  .count(false) > 0;

Teams.findTeamsWithUserInvitedState = userId => Teams
  .find({
    participants: {
      $elemMatch: {
        _id: userId,
        state: INVITED,
      },
    },
  });

Teams.findTeamsWithUserActiveState = userId => Teams
  .find({
    participants: {
      $elemMatch: {
        _id: userId,
        state: ACTIVE,
      },
    },
  });

