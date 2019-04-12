import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

Meteor.startup(() => {
  render(<HelloWorld />, document.getElementById('app'));
});


class HelloWorld extends React.Component {
  render() {
    return (
      <h1>Hello World!</h1>
    );
  }
}

