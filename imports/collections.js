import { Mongo } from "meteor/mongo";
import { promisify } from "util";

export const Quizzes = new Mongo.Collection("quizzes");

Quizzes.insertAsync = promisify(Quizzes.insert);

Quizzes.updateAsync = promisify(Quizzes.update);

Quizzes.removeAsync = promisify(Quizzes.remove);
