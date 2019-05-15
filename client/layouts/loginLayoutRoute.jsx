import React from 'react';
import { Route } from 'react-router-dom';
import LoginLayout from './loginLayout';

const LoginLayoutRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={matchProps => (
      <LoginLayout>
        <Component {...matchProps} />
      </LoginLayout>
    )}
  />
);

export default LoginLayoutRoute;
