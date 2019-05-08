import { Meteor } from "meteor/meteor";
import { promisify } from "util";

Meteor.callAsync = promisify(Meteor.call);

export default {
  quizzes: {
    updateAsync: (quiz) => Meteor.callAsync("quizzes.update", quiz),

    insertAsync: (quiz) => Meteor.callAsync("quizzes.insert", quiz),

    removeAsync: (quizId) => Meteor.callAsync("quizzes.remove", quizId)
  }
}