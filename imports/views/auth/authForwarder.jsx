import React from 'react';
import { compose } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";

function authForwarder(WrappedComponent) {
  return class extends React.Component {
    isAuthenticated() {
      return this.props.userId !== null
    }

    componentWillMount() {
      if (!this.isAuthenticated()) {
        this.props.history.push('/login');
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!this.isAuthenticated()) {
        this.props.history.push('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default compose(
  withTracker(() => {
    return {
      userId: Meteor.userId()
    }
  }),

  withRouter,
  authForwarder
);