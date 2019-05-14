import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import Participant from './participant';
import { ACTIVE } from './participantStates';

export default class Team {
  title;

  description;

  participants;

  constructor(doc) {
    Object.assign(
      this,
      doc,
      {
        participants: mapValues(
          doc.participants,
          participant => new Participant(participant),
        ),
      },
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
