import get from 'lodash/get';

export function getUserFullName(user) {
  return `${get(user, 'profile.firstName', '')} ${get(user, 'profile.lastName', '')}`
    .trim() || undefined;
}
