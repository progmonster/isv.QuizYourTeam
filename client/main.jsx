import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import Button from "@material-ui/core/Button";


Meteor.startup(() => {
  render(<HelloWorld />, document.getElementById('app'));
});


class HelloWorld extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <Button variant="contained" color="primary">Click Me!</Button>
      </div>
    );
  }
}

