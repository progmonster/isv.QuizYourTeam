import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import './methods';
import './publications';

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl(`verify-email?token=${token}`);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl(`set-initial-password?token=${token}`);
};

Accounts.emailTemplates.from = 'akatorgin@yandex.ru';// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});


Meteor.startup(() => {
  // code to run on server at startup
});
