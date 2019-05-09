import './methods';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import '/imports/assets/css/material-dashboard-react.css'; // todo check if it works
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import SignInPage from '../imports/views/auth/SignInPage';
import SignUpPage from '../imports/views/auth/SignUpPage';
import SignUpConfirmationNotePage from '../imports/views/auth/SignUpConfirmationNotePage';
import EmailVerificationPage from '../imports/views/auth/EmailVerificationPage';
import { routes } from '../imports/routes';
import MainLayoutRoute from '../imports/layouts/MainLayoutRoute';
import LoginLayoutRoute from '../imports/layouts/LoginLayoutRoute';
import reducers from '../imports/reducers';
import { rootSaga } from '../imports/actions';
import SnackbarProvider from '../imports/components/snackbar/SnackbarProvider';

Meteor.subscribe('quizzes');
Meteor.subscribe('teams');

Meteor.startup(() => {
  const hist = createBrowserHistory();

  const loggerMiddleware = createLogger();

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    applyMiddleware(loggerMiddleware, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  const mainLayoutRoutes = routes.map((prop, key) => (
    <MainLayoutRoute
      path={prop.path}
      component={prop.component}
      key={key}
    />
  ));

  ReactDOM.render(
    <Provider store={store}>
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 3500 }}>
        <Router history={hist}>
          <Switch>
            <Route exact path="/">
              <Redirect from="/" to="/dashboard" />
            </Route>

            <LoginLayoutRoute path="/login" component={SignInPage} />
            <LoginLayoutRoute path="/signup" component={SignUpPage} />
            <LoginLayoutRoute path="/signup-confirmation-note"
                              component={SignUpConfirmationNotePage} />
            <LoginLayoutRoute path="/verify-email" component={EmailVerificationPage} />

            {mainLayoutRoutes}
          </Switch>
        </Router>
      </SnackbarProvider>
    </Provider>,

    document.getElementById('root'),
  );
});
