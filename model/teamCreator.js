import { getUserEmail, getUserFullName } from '../users/userUtils';

export default class TeamCreator {
  _id;

  email;

  fullName;

  constructor(doc) {
    this._id = doc._id;
    this.email = doc.email;
    this.fullName = doc.fullName;
  }

  static createFromUser(user) {
    return new TeamCreator({
      _id: user._id,
      email: getUserEmail(user),
      fullName: getUserFullName(user),
    });
  }
}
