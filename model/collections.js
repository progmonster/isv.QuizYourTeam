import { Mongo } from 'meteor/mongo';

// todo progmonster  move to model
export class Team {
  constructor({ title, description }) {
    this.title = title;
    this.description = description;
  }
}

export const Quizzes = new Mongo.Collection('quizzes');

export const Teams = new Mongo.Collection('teams', {
  transform: doc => new Team(doc),
});
