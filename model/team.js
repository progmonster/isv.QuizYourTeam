export default class Team {
  title;

  description;

  constructor(doc) {
    Object.assign(this, doc);
  }
}
