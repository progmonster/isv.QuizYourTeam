export const Meteor = {
  startup: jest.fn(),
  settings: {
    public: {
      errorMonitor: {
        enabled: true,
        host: 'elkHost',
        user: 'elkUser',
        password: 'elkPassword',
      },
      mainHost: 'simpletexting.com'
    },
  },
  isCordova: false,
};
export const Mongo = {
  Collection: jest.fn(),
};
export const check = jest.fn();
export const Match = { Where: jest.fn() };

export const Tracker = { Dependency: jest.fn() };

export const HTTP = {
  call: jest.fn(),
};

export const ReactiveDict = function() {};

export const Roles = {
  userIsInRole: jest.fn(),
  addUsersToRoles: jest.fn(),
};
