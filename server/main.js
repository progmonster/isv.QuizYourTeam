import { Meteor } from 'meteor/meteor';

import { Quizzes } from "../imports/collections"

Meteor.publish("quizzes", () => {
  return Quizzes.find();
});

Meteor.publish("quiz", (quizId) => {
  return Quizzes.find(quizId);
});

Meteor.startup(() => {
  // code to run on server at startup
});
