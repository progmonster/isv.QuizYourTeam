import sumBy from 'lodash/sumBy';
import some from 'lodash/some';
import TeamParticipant from './teamParticipant';
import { ACTIVE, INVITED } from './participantStates';
import TeamCreator from './teamCreator';

export default class Team {
  title;

  description;

  creator;

  participants;

  constructor(doc) {
    this.title = doc.title;
    this.description = doc.description;
    this.creator = new TeamCreator(doc.creator);

    this.participants = doc.participants.map(
      participant => new TeamParticipant(participant),
    );
  }

  getActiveParticipantCount() {
    return sumBy(this.participants, ({ state }) => (state === ACTIVE ? 1 : 0));
  }

  isUserInInvitedState(userId) {
    return some(this.participants, {
      _id: userId,
      state: INVITED,
    });
  }
}
