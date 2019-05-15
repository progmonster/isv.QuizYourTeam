import { getUserEmail, getUserFullName } from '../users/userUtils';

export default class TeamParticipant {
  _id;

  invitedAt;

  joinedAt;

  email;

  fullName;

  state;

  constructor(doc) {
    this._id = doc._id;
    this.invitedAt = doc.invitedAt;
    this.joinedAt = doc.joinedAt;
    this.email = doc.email;
    this.fullName = doc.fullName;
    this.state = doc.state;
  }

  static createFromUser(user) {
    return new TeamParticipant({
      _id: user._id,
      email: getUserEmail(user),
      fullName: getUserFullName(user),
    });
  }
}
