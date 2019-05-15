import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import TeamParticipant from './teamParticipant';
import { ACTIVE } from './participantStates';
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

    this.participants = mapValues(
      doc.participants,
      participant => new TeamParticipant(participant),
    );
  }

  getActiveParticipantCount() {
    return reduce(
      this.participants,
      (count, participant) => count + (participant.state === ACTIVE ? 1 : 0),
      0,
    );
  }
}
