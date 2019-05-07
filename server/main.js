import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from "meteor/accounts-base";
import { Email } from "meteor/email";

import { Quizzes } from "../imports/collections"

Meteor.publish("quizzes", () => {
  return Quizzes.find();
});

Meteor.publish("quiz", (quizId) => {
  return Quizzes.find(quizId);
});

Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl("verify-email?token=" + token)
};

Accounts.emailTemplates.from = "akatorgin@yandex.ru";// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});

//process.env.MAIL_URL="MAIL_URL=smtps://akatorgin:<password>@smtp.yandex.ru:465";

Accounts.onCreateUser((options, user) => {
  user.profile = {};

  console.log("here");
  console.log(JSON.stringify(user));
//  Accounts.sendVerificationEmail(user._id);

  return user;
});

if (Meteor.isDevelopment) {
// todo progmonster remove!
  Meteor.methods({
    sendEmail(to, from, subject, text) {
      // Make sure that all arguments are strings.
      check([to, from, subject, text], [String]);


      // Let other method calls from the same client start running, without
      // waiting for the email sending to complete.
      this.unblock();

      Email.send({ to, from, subject, text });
    }
  });
}

Meteor.startup(() => {
  // code to run on server at startup
});


/*
Meteor.call(
  'sendEmail',
  'Alexei2 <progmonster+2@gmail.com>',
  'akatorgin@yandex.ru',
  'Hello from Meteor!',
  'This is a test of Email.send.'
);
*/