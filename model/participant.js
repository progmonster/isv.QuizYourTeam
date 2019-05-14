export default class Participant {
  userId;

  joinedAt;

  email;

  fullName;

  state;

  constructor(doc) {
    Object.assign(this, doc);
  }
}
