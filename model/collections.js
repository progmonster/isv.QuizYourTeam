import { Mongo } from 'meteor/mongo';
import Team from './team';

export const Quizzes = new Mongo.Collection('quizzes');

export const Teams = new Mongo.Collection('teams', {
  transform: doc => new Team(doc),
});
